<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>
<body>
    
    <table class="table">
    <thead>
        <tr>
        <th scope="col">sifra</th>
        <th scope="col">cena</th>
        <th scope="col">vrednost</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($data as $dt)
            <tr>
            <td>{{ $dt->sifra }}</td>
            <td>{{ $dt->cena }}</td>
            <td>{{ $dt->vrednost }}</td>
            </tr>
        @endforeach()
    </tbody>
    </table>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

</body>
</html>