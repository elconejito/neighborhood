<?php

namespace App\Support\QueryFilter;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class FilterParser
{
    private const ALLOWED_OPERATORS = ['like', '=', '!=', '>', '<', '>=', '<=', 'in', 'between'];

    public function __construct(
        protected Builder $query,
        protected Request $request,
        protected Model $model
    ) {}

    public function apply(): Builder
    {
        $this->applySearch();
        $this->applyFilter();
        $this->applyOrderBy();

        return $this->query;
    }

    private function applySearch(): void
    {
        if (! $this->request->has('search')) {
            return;
        }

        $search = $this->request->input('search');
        $searchJoin = strtolower($this->request->input('searchJoin', 'or')) === 'and' ? 'and' : 'or';
        $fieldMap = $this->resolveSearchFields();

        if (empty($fieldMap)) {
            return;
        }

        $this->query->where(function (Builder $q) use ($search, $fieldMap, $searchJoin) {
            foreach ($fieldMap as $i => [$column, $operator]) {
                $useOr = $searchJoin === 'or' && $i > 0;

                match ($operator) {
                    'in' => $useOr
                        ? $q->orWhereIn($column, $this->parseListValue($search))
                        : $q->whereIn($column, $this->parseListValue($search)),
                    'between' => $this->applyBetween($q, $column, $search, $useOr),
                    'like' => $useOr
                        ? $q->orWhere($column, 'like', "%{$search}%")
                        : $q->where($column, 'like', "%{$search}%"),
                    default => $useOr
                        ? $q->orWhere($column, $operator, $search)
                        : $q->where($column, $operator, $search),
                };
            }
        });
    }

    /**
     * Returns [ [column, operator], ... ] based on ?searchFields or model's $searchable.
     *
     * @return array<int, array{0: string, 1: string}>
     */
    private function resolveSearchFields(): array
    {
        $allowedColumns = array_merge(
            $this->model->searchable ?? [],
            $this->model->filterable ?? []
        );

        if ($this->request->has('searchFields')) {
            $pairs = explode(';', $this->request->input('searchFields'));
            $result = [];

            foreach ($pairs as $pair) {
                [$column, $operator] = array_pad(explode(':', trim($pair), 2), 2, 'like');
                $column = trim($column);
                $operator = strtolower(trim($operator));

                if (! in_array($column, $allowedColumns, true)) {
                    continue;
                }

                if (! in_array($operator, self::ALLOWED_OPERATORS, true)) {
                    $operator = '=';
                }

                $result[] = [$column, $operator];
            }

            return $result;
        }

        // Fall back to model's $searchable, defaulting to 'like'
        return array_map(
            fn (string $col) => [$col, 'like'],
            $this->model->searchable ?? []
        );
    }

    private function applyBetween(Builder $q, string $column, string $value, bool $useOr): void
    {
        $parts = array_map('trim', explode(',', $value));

        if (count($parts) < 2) {
            // Not enough values — fall back to exact match
            $useOr
                ? $q->orWhere($column, '=', $parts[0])
                : $q->where($column, '=', $parts[0]);

            return;
        }

        $useOr
            ? $q->orWhereBetween($column, [$parts[0], $parts[1]])
            : $q->whereBetween($column, [$parts[0], $parts[1]]);
    }

    private function applyFilter(): void
    {
        if (! $this->request->has('filter')) {
            return;
        }

        $requested = array_map('trim', explode(';', $this->request->input('filter')));

        // Ground-truth guard: only columns that actually exist on the table
        $schemaColumns = Schema::getColumnListing($this->model->getTable());

        // Optional model-level restriction
        $modelFilterable = $this->model->filterable ?? [];
        $allowedColumns = empty($modelFilterable)
            ? $schemaColumns
            : array_intersect($schemaColumns, $modelFilterable);

        $selected = array_values(array_intersect($requested, $allowedColumns));

        // Always include the primary key so Eloquent relationships resolve
        $primaryKey = $this->model->getKeyName();
        if (! in_array($primaryKey, $selected, true)) {
            array_unshift($selected, $primaryKey);
        }

        if (! empty($selected)) {
            $this->query->select($selected);
        }
    }

    private function applyOrderBy(): void
    {
        $column = $this->request->input('orderBy');

        if (! $column) {
            return;
        }

        $sortable = $this->model->sortable ?? [];

        if (! in_array($column, $sortable, true)) {
            return;
        }

        $direction = strtolower($this->request->input('sortedBy', 'asc')) === 'desc' ? 'desc' : 'asc';
        $customSortMethod = 'apply'.Str::studly($column).'Sort';

        if (method_exists($this->model, $customSortMethod)) {
            $this->model->{$customSortMethod}($this->query, $direction);

            return;
        }

        $this->query->orderBy($column, $direction);
    }

    /** @return array<int, string> */
    private function parseListValue(string $value): array
    {
        return array_map('trim', explode(',', $value));
    }
}
