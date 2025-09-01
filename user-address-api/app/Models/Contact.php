use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

class Contact extends Model
{
	use HasFactory;

	protected $fillable = [
		'user_id',
		'name',
		'cpf',
		'phone',
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

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
