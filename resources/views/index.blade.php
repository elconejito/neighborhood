<!DOCTYPE html>
<html>
    <head>
        <title>Laravel</title>

        <link href="//fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css">
        <link href="{{ asset('/css/app.css') }}" rel="stylesheet" type="text/css" />
        
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/react.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/JSXTransformer.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js"></script>
        
        <script src="{{ asset('/js/vendor.js') }}"></script>
    </head>
    <body>

        @include('partials.nav')

        <div class="container">
            <div id="content">

                @include('partials.forms.location')

                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Address</th>
                                <th>Type</th>
                                <th>Details</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1234</td>
                                <td>Street</td>
                                <td>1</td>
                                <td><i class="fa fa-info"></i></td>
                                <td><i class="fa fa-bars"></i></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
            <script type="text/jsx">

            </script>
        </div>

    </body>
</html>
