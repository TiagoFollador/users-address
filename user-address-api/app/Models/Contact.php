<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

/**
 * @OA\Schema(
 *     schema="Contact",
 *     type="object",
 *     title="Contact",
 *     description="Modelo de contato",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="user_id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Maria Silva"),
 *     @OA\Property(property="email", type="string", format="email", example="maria@example.com"),
 *     @OA\Property(property="phone", type="string", example="11999999999"),
 *     @OA\Property(property="cpf", type="string", example="123.456.789-00"),
 *     @OA\Property(property="cep", type="string", example="01234-567"),
 *     @OA\Property(property="street", type="string", example="Rua das Flores"),
 *     @OA\Property(property="number", type="string", example="123"),
 *     @OA\Property(property="complement", type="string", example="Apto 101"),
 *     @OA\Property(property="neighborhood", type="string", example="Centro"),
 *     @OA\Property(property="city", type="string", example="São Paulo"),
 *     @OA\Property(property="state", type="string", example="SP"),
 *     @OA\Property(property="latitude", type="number", format="float", example=-23.5505),
 *     @OA\Property(property="longitude", type="number", format="float", example=-46.6333),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00.000000Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-01T00:00:00.000000Z")
 * )
 */
class Contact extends Model
{
	use HasFactory;

	// Match columns defined in the contacts migration
	protected $fillable = [
		'user_id',
		'name',
		'email',
		'phone',
		'cpf',
		'cep',
		'street',
		'number',
		'complement',
		'neighborhood',
		'city',
		'state',
		'latitude',
		'longitude',
	];

	protected $casts = [
		'created_at' => 'datetime',
		'updated_at' => 'datetime',
		'latitude' => 'float',
		'longitude' => 'float',
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	/**
	 * Get the contact's formatted address.
	 */
	public function getFormattedAddressAttribute(): string
	{
		$parts = [];
		
		if ($this->street) {
			$addressPart = $this->street;
			if ($this->number) {
				$addressPart .= ', ' . $this->number;
			}
			$parts[] = $addressPart;
		}
		
		if ($this->complement) {
			$parts[] = $this->complement;
		}
		
		if ($this->neighborhood) {
			$parts[] = $this->neighborhood;
		}
		
		if ($this->city) {
			$parts[] = $this->city;
		}
		
		if ($this->state) {
			$parts[] = $this->state;
		}
		
		if ($this->cep) {
			$parts[] = $this->cep;
		}
		
		return implode(', ', $parts);
	}

	/**
	 * Scope a query to search contacts by name or email.
	 */
	public function scopeSearch($query, string $search)
	{
		return $query->where(function ($q) use ($search) {
			$q->where('name', 'like', "%{$search}%")
			  ->orWhere('email', 'like', "%{$search}%");
		});
	}

	/**
	 * Scope a query to filter contacts by city.
	 */
	public function scopeByCity($query, string $city)
	{
		return $query->where('city', $city);
	}
}
