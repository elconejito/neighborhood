<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFieldsToLocationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->integer('bedrooms');
            $table->integer('bathrooms');
            $table->integer('sqft');
            $table->integer('built');
            $table->string('mlsid');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn([ 'bedrooms', 'bathrooms', 'sqft', 'built', 'mlsid' ]);
        });
    }
}
