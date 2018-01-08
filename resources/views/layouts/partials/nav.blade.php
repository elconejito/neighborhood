<nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
        <span class="navbar-brand">Rabbit Home</span>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarPrimary" aria-controls="navbarPrimary" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarPrimary">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link {{ active('home') }}" href="{{ url('/') }}">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link {{ active('locations.index') }}" href="{{ route('locations.index') }}">Locations</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Prices</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Reports</a>
                </li>
            </ul>
        </div>
    </div>
</nav>
