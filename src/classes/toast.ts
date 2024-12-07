import { Toast } from "@/hooks/use-toast";

type ToasterToast = (toast: Toast) => void;

export default class AlertToast {
  public toast: ToasterToast;
  private static _instance: AlertToast | null = null;

  private constructor(toast: ToasterToast) {
    this.toast = toast;
  }

  // Static method to initialize the instance
  static initialize(toast: ToasterToast) {
    if (!this._instance) {
      this._instance = new AlertToast(toast);
    }
  }

  // Static method to get the current instance
  private static getInstance(): AlertToast {
    if (!this._instance) {
      throw new Error("Toaster is not initialized. Call 'initialize' first.");
    }
    return this._instance;
  }

  // Static method for success messages
  static success(message: string) {
    const instance = this.getInstance();
    instance.toast({
      description: message,
    });
  }

  static error(message: string) {
    const instance = this.getInstance();
    instance.toast({
      variant: "destructive",
      description: message,
    });
  }
}
