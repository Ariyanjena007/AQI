import { HardwareTelemetryContract } from '../types/digitalTwin';

type PacketCallback = (data: Partial<HardwareTelemetryContract>) => void;
type StatusCallback = (status: 'disconnected' | 'connecting' | 'connected' | 'error', message?: string) => void;

class WebSerialService {
  private port: any = null;
  private reader: any = null;
  private isReading = false;
  private onPacket: PacketCallback | null = null;
  private onStatus: StatusCallback | null = null;
  private buffer = '';

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'serial' in navigator;
  }

  public setCallbacks(packetCb: PacketCallback, statusCb: StatusCallback) {
    this.onPacket = packetCb;
    this.onStatus = statusCb;
  }

  public async connect(baudRate: number = 115200): Promise<boolean> {
    if (!this.isSupported()) {
      if (this.onStatus) this.onStatus('error', 'Web Serial API is not supported in this browser. Please use Google Chrome or Edge.');
      return false;
    }

    try {
      if (this.onStatus) this.onStatus('connecting', 'Requesting serial port permission...');
      // @ts-ignore
      this.port = await (navigator as any).serial.requestPort();
      await this.port.open({ baudRate });

      if (this.onStatus) this.onStatus('connected', `Connected to Arduino UNO Q at ${baudRate} baud`);
      this.isReading = true;
      this.readLoop();
      return true;
    } catch (err: any) {
      if (this.onStatus) this.onStatus('error', err.message || 'Failed to open serial port');
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    this.isReading = false;
    try {
      if (this.reader) {
        await this.reader.cancel();
        this.reader = null;
      }
      if (this.port) {
        await this.port.close();
        this.port = null;
      }
      if (this.onStatus) this.onStatus('disconnected', 'Serial port disconnected');
    } catch (err: any) {
      console.warn('Error during serial port close:', err);
    }
  }

  private async readLoop() {
    const textDecoder = new TextDecoderStream();
    // @ts-ignore
    const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();
    this.reader = reader;

    try {
      while (this.isReading) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          this.buffer += value;
          const lines = this.buffer.split('\n');
          this.buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
              try {
                const parsed = JSON.parse(trimmed);
                if (this.onPacket) {
                  this.onPacket(parsed);
                }
              } catch (e) {
                // Ignore partial JSON
              }
            }
          }
        }
      }
    } catch (err: any) {
      if (this.isReading && this.onStatus) {
        this.onStatus('error', err.message || 'Serial stream interrupted');
      }
    } finally {
      reader.releaseLock();
    }
  }
}

export const webSerialService = new WebSerialService();
