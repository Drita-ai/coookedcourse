const Card = (({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`rounded-2xl border bg-card text-card-foreground shadow-sm ${className}`}
        {...props}
    />
));

export default Card;