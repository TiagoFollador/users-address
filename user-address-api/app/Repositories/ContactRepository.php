<?php

namespace App\Repositories;

use App\Models\Contact;
use App\Models\User;
use App\Repositories\ContactRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ContactRepository implements ContactRepositoryInterface
{
    public function getUserContacts(User $user): Collection
    {
        return $user->contacts()
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function create(User $user, array $data): Contact
    {
        return $user->contacts()->create($data);
    }

    public function findUserContact(User $user, int $id): ?Contact
    {
        return $user->contacts()->find($id);
    }

    public function update(Contact $contact, array $data): Contact
    {
        $contact->update($data);
        
        return $contact->fresh();
    }

    public function delete(Contact $contact): bool
    {
        return $contact->delete();
    }

    public function deleteUserContacts(User $user): void
    {
        $user->contacts()->delete();
    }
}
