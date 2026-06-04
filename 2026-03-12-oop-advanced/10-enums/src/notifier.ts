export default abstract class Notifier {
    abstract sendMessage(to: string, message: string): void
}