// Usuarios simulados
const MOCK_USERS = [
  {
    id: 1,
    email: "admin@elitedrive.com",
    password: "admin123",
    role: "ADMIN",
    name: "Administrator",
    firstName: "Admin",
    lastName: "User",
    phone: "+503 1234-5678"
  },
  {
    id: 2,
    email: "customer@elitedrive.com", 
    password: "customer123",
    role: "CUSTOMER",
    name: "John Doe",
    firstName: "John",
    lastName: "Doe",
    phone: "+503 8765-4321"
  },
  {
    id: 3,
    email: "usuario@test.com",
    password: "123456",
    role: "CUSTOMER", 
    name: "Usuario Test",
    firstName: "Usuario",
    lastName: "Test",
    phone: "+503 5555-5555"
  }
];

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isLoggedIn = false;
  }

  // Login simplificado
  async login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const user = MOCK_USERS.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
          );

          if (!user) {
            reject(new Error("Credenciales inválidas"));
            return;
          }

          this.currentUser = {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone
          };
          
          this.isLoggedIn = true;

          resolve({
            user: this.currentUser,
            message: "Login exitoso"
          });

        } catch (error) {
          reject(new Error("Error interno del servidor"));
        }
      }, 300);
    });
  }

  // Cerrar sesión
  logout() {
    this.currentUser = null;
    this.isLoggedIn = false;
  }

  // Verificar autenticación
  isAuthenticated() {
    return this.isLoggedIn && this.currentUser !== null;
  }

  // Obtener usuario actual
  getUser() {
    return this.isAuthenticated() ? this.currentUser : null;
  }

  // Verificar rol
  hasRole(role) {
    const user = this.getUser();
    return user && user.role === role;
  }

  // Verificar si es admin
  isAdmin() {
    return this.hasRole("ADMIN");
  }

  // Verificar si es customer
  isCustomer() {
    return this.hasRole("CUSTOMER");
  }

  // Obtener usuarios para testing
  getMockUsers() {
    return MOCK_USERS.map(user => ({
      email: user.email,
      password: user.password,
      role: user.role,
      name: user.name
    }));
  }
}

// Exportar instancia singleton
const authService = new AuthService();
export default authService;