"use client";
import Image from "next/image";

interface Testimonial {
  customerName: string;
  customerTitle?: string;
  customerLogo?: string;
  testimonial: string;
  metrics?: string;
  verified?: boolean;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900 mb-4">Customer Testimonials</h2>
      
      <div className="space-y-4">
        {testimonials.map((testimonial, idx) => (
          <div 
            key={idx}
            className="p-4 bg-zinc-50 rounded-lg border border-zinc-200"
          >
            <div className="flex items-start mb-3">
              {testimonial.customerLogo && (
                <div className="mr-3 h-10 w-10 flex-shrink-0">
                  <Image
                    src={testimonial.customerLogo}
                    alt={testimonial.customerName}
                    width={40}
                    height={40}
                    className="object-contain rounded-full"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-zinc-900">
                  {testimonial.customerName}
                  {testimonial.verified && (
                    <span className="ml-2 text-blue-600" title="Verified">
                      ✓
                    </span>
                  )}
                </h3>
                {testimonial.customerTitle && (
                  <p className="text-xs text-zinc-600">{testimonial.customerTitle}</p>
                )}
              </div>
            </div>
            
            <p className="text-sm text-zinc-700 mb-3 italic">"{testimonial.testimonial}"</p>
            
            {testimonial.metrics && (
              <div className="pt-3 border-t border-zinc-200">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Results</p>
                <p className="text-sm font-semibold text-green-600">{testimonial.metrics}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

