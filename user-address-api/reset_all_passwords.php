<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$new = '12345678';
$count = 0;
foreach (User::cursor() as $u) {
    $u->password = Hash::make($new);
    $u->save();
    $count++;
}

echo "Updated $count users' passwords to $new\n";
