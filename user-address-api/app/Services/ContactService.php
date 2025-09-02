<?php

namespace App\Services;

use App\Models\Contact;
use App\Models\User;
use App\Repositories\ContactRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ContactService
{
    public function __construct(
        private ContactRepositoryInterface $contactRepository,
        private OpenStreetMapService $geocodingService
    ) {}

    public function getUserContacts(User $user, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->contactRepository->getUserContacts($user, $filters, $perPage);
    }

    public function createContact(User $user, array $data): Contact
    {
        $data = $this->addCoordinates($data);
        
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
        
        if ($this->hasAddressFields($data)) {
            $data = $this->addCoordinates($data);
        }
        
        return $this->contactRepository->update($contact, $data);
    }

    public function deleteContact(User $user, int $id): void
    {
        $contact = $this->getContact($user, $id);
        
        $this->contactRepository->delete($contact);
    }

    /**
     * Add coordinates using OpenStreetMap Geocoding API
     */
    private function addCoordinates(array $data): array
    {
        if ($this->hasAddressFields($data)) {
            $coordinates = $this->geocodingService->getCoordinatesFromAddress($data);
            $data['latitude'] = (string) $coordinates['latitude'];
            $data['longitude'] = (string) $coordinates['longitude'];
        }

        return $data;
    }

    /**
     * Check if data contains address fields
     */
    private function hasAddressFields(array $data): bool
    {
        $addressFields = ['street', 'number', 'complement', 'neighborhood', 'city', 'state', 'cep'];
        
        foreach ($addressFields as $field) {
            if (isset($data[$field])) {
                return true;
            }
        }
        
        return false;
    }
}
