export default function LoadingSpinner({ size = 36 }: { size?: number }) {
    return (
        <div className="flex items-center justify-center">
            <div
                className="spinner"
                style={{ width: size, height: size }}
                aria-hidden="true"
            />
        </div>
    );
}
