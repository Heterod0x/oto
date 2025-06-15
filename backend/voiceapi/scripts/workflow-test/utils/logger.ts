export class Logger {
  private static formatTimestamp(): string {
    return new Date().toISOString();
  }

  static log(message: string, data?: any): void {
    const timestamp = this.formatTimestamp();
    console.log(`[${timestamp}] ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }

  static error(message: string, error?: any): void {
    const timestamp = this.formatTimestamp();
    console.error(`[${timestamp}] ❌ ${message}`);
    if (error) {
      console.error(error);
    }
  }

  static success(message: string, data?: any): void {
    this.log(`✅ ${message}`, data);
  }

  static info(message: string, data?: any): void {
    this.log(`ℹ️ ${message}`, data);
  }

  static warning(message: string, data?: any): void {
    this.log(`⚠️ ${message}`, data);
  }

  static section(title: string): void {
    this.log(`\n=== ${title} ===`);
  }
}
