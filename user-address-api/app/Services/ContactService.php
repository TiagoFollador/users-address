<?php

namespace App\Services;

use App\Models\Contact;
use App\Models\User;
use App\Repositories\ContactRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ContactService
{
    public function __construct(
        private ContactRepositoryInterface $contactRepository
    ) {}

    public function getUserContacts(User $user): Collection
    {
        return $this->contactRepository->getUserContacts($user);
    }

    public function createContact(User $user, array $data): Contact
    {
        return $this->contactRepository->create($user, $data);
    }

    public function getContact(User $user, int $id): Contact
    {
        $contact = $this->contactRepository->findUserContact($user, $id);
        
        if (!$contact) {
            throw new \Exception('Contato não encontrado', 404);
        }

        return $contact;
    }

    public function updateContact(User $user, int $id, array $data): Contact
    {
        $contact = $this->getContact($user, $id);
        
        return $this->contactRepository->update($contact, $data);
    }

    public function deleteContact(User $user, int $id): void
    {
        $contact = $this->getContact($user, $id);
        
        $this->contactRepository->delete($contact);
    }
}
