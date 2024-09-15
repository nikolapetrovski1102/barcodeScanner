<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/api/data', function () {
    $data = DB::table('adapteri_nipli')
    ->leftJoin('adapteri_nipli_details', 'adapteri_nipli.sifra', '=', 'adapteri_nipli_details.sifra')
    ->select('adapteri_nipli.sifra', 'adapteri_nipli_details.cena', 'adapteri_nipli_details.vrednost')
    ->get();

    return $data;
});