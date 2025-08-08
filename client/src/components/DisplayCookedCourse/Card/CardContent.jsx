const CardContent = (({ className, ...props }, ref) => (
    <div ref={ref} className={`p-6 ${className}`} {...props} />
));

export default CardContent;