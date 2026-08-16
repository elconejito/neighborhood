<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Team\InviteMemberRequest;
use App\Http\Requests\Api\V1\Team\RemoveMemberRequest;
use App\Models\Team;
use App\Models\User;
use App\Transformers\Api\V1\TeamTransformer;
use App\Transformers\Api\V1\UserTransformer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $teams = $request->user()->teams()->orderBy('name')->get();

        return fractal($teams, new TeamTransformer)->respond();
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $team = $request->user()->teams()->create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'personal_team' => false,
        ]);

        return fractal($team, new TeamTransformer)->respond(201);
    }

    public function update(Request $request, Team $team): JsonResponse
    {
        if (! $request->user()->teams()->where('teams.id', $team->id)->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $team->update(['name' => $request->name]);

        return fractal($team, new TeamTransformer)->respond();
    }

    public function switch(Request $request, Team $team): JsonResponse
    {
        if (! $request->user()->teams()->where('teams.id', $team->id)->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->user()->update(['team_id' => $team->id]);

        return response()->json([
            'data' => [
                'message' => 'Team switched successfully',
                'user' => fractal($request->user()->fresh(), new UserTransformer)->toArray()['data'],
            ],
        ]);
    }

    public function invite(InviteMemberRequest $request): JsonResponse
    {
        $user = $request->user();
        if (! $user->team_id) {
            return response()->json(['message' => 'User does not have a team.'], 422);
        }

        $invitedUser = User::where('email', $request->email)->first();

        if (! $invitedUser) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($invitedUser->teams()->where('teams.id', $user->team_id)->exists()) {
            return response()->json(['message' => 'User is already on this team.'], 422);
        }

        $invitedUser->teams()->attach($user->team_id);

        return fractal($invitedUser, new UserTransformer)->respond();
    }

    public function members(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user->team_id) {
            return response()->json(['data' => []]);
        }

        $members = $user->team->users()->orderBy('name')->get();

        return fractal($members, new UserTransformer)->respond();
    }

    public function remove(RemoveMemberRequest $request, User $member): JsonResponse
    {
        $user = $request->user();

        if ($member->id === $user->id) {
            return response()->json(['message' => 'You cannot remove yourself from the team.'], 422);
        }

        if (! $member->teams()->where('teams.id', $user->team_id)->exists()) {
            return response()->json(['message' => 'User is not on your team.'], 403);
        }

        $member->teams()->detach($user->team_id);

        // If the removed team was their active team, set it to another one or null
        if ($member->team_id === $user->team_id) {
            $nextTeam = $member->teams()->first();
            $member->update(['team_id' => $nextTeam ? $nextTeam->id : null]);
        }

        return response()->json(['message' => 'Member removed successfully.']);
    }
}
