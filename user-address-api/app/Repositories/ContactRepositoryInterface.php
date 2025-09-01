<?php

namespace App\Repositories;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface ContactRepositoryInterface
{
    public function getUserContacts(User $user): Collection;
    public function create(User $user, array $data): Contact;
    public function findUserContact(User $user, int $id): ?Contact;
    public function update(Contact $contact, array $data): Contact;
    public function delete(Contact $contact): bool;
    public function deleteUserContacts(User $user): void;
}
