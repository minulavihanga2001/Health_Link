// Basic API Configuration
export const API_URL = 'https://fhf9748v-8080-inspect.asse.devtunnels.ms'; // Check if /api/v1 needs to be appended or if client handles it.
// AuthContext formerly used: `${API_URL}/api/v1` - wait.
// In auth.ts: export const API_URL = 'https://...';
// In axios.create: baseURL: API_URL
// In calls: api.post('/auth/signup') -> 'https://.../auth/signup'
// BUT previously it was: 'http://192.168.8.162:8080/api/v1'
// The dev tunnel URL likely points to localhost:8080.
// So the base URL should probably include /api/v1 if the backend expects it.
// Let's check the backend controller mappings.
// DoctorController: @RequestMapping("/api/v1/doctor")
// So yes, we should append /api/v1 to the base URL or include it in the calls.
// Best practice: Base URL = Root of API.
export const BASE_URL = 'https://fhf9748v-8080-inspect.asse.devtunnels.ms/api/v1';
