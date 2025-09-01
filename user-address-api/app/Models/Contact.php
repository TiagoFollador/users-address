<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

class Contact extends Model
{
	use HasFactory;

	protected $fillable = [
		'user_id',
		'name',
		'email',
		'phone',
		'address',
		'neighborhood',
		'city',
		'state',
		'zip_code',
	];

	protected $casts = [
		'created_at' => 'datetime',
		'updated_at' => 'datetime',
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
		return "{$this->address}, {$this->neighborhood}, {$this->city} - {$this->state}, {$this->zip_code}";
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
