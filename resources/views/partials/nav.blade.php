    <nav class="navbar navbar-fixed-top navbar-dark bg-inverse">
        <div class="container">
            <span class="navbar-brand">Rabbit Home</span>
            <ul class="nav navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="{{ url('/') }}">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('locations.index') }}">Locations</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Prices</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Reports</a>
                </li>
            </ul>
        </div>
    </nav>