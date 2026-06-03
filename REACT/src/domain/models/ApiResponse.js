// Modèle pour standardiser les réponses API
export class ApiResponse {
  constructor(success, data = null, error = null) {
    this.success = success;
    this.data = data;
    this.error = error;
  }

  static success(data) {
    return new ApiResponse(true, data);
  }

  static error(error) {
    return new ApiResponse(false, null, error);
  }
}