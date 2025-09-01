<?php

namespace App\Repositories;

use App\Models\Contact;
use App\Models\User;
use App\Repositories\ContactRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ContactRepository implements ContactRepositoryInterface
{
    public function getUserContacts(User $user, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $user->contacts();

        // Apply filters
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('cpf', 'like', "%{$search}%")
                  ->orWhere('street', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['city'])) {
            $query->where('city', 'like', "%{$filters['city']}%");
        }

        if (!empty($filters['state'])) {
            $query->where('state', $filters['state']);
        }

        // Apply ordering
        $orderBy = $filters['order_by'] ?? 'created_at';
        $orderDirection = $filters['order_direction'] ?? 'desc';
        
        // Validate order_by field to prevent SQL injection
        $allowedOrderFields = ['name', 'email', 'city', 'created_at', 'updated_at'];
        if (!in_array($orderBy, $allowedOrderFields)) {
            $orderBy = 'created_at';
        }
        
        // Validate order direction
        $orderDirection = in_array(strtolower($orderDirection), ['asc', 'desc']) ? $orderDirection : 'desc';
        
        $query->orderBy($orderBy, $orderDirection);

        return $query->paginate($perPage);
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
