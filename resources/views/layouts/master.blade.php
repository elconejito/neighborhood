<!DOCTYPE html>
<html lang="en">

@include('layouts.partials.head')

<body>

@include('layouts.partials.nav')

@include('layouts.partials.errors')

<div class="container main-content">
@section('content')
    This is the default content
@show
</div><!-- /.container.main-content -->

@include('layouts.partials.footer')

<!-- Bootstrap core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="{{ asset('/assets/js/manifest.js') }}"></script>
<script src="{{ asset('/assets/js/vendor.js') }}"></script>
<script src="{{ asset('/assets/js/app.js') }}"></script>
</body>
</html>
