"use client";

interface Product {
  name: string;
  description: string;
  category?: string[];
  features?: string[];
  demoLink?: string;
  trialLink?: string;
}

interface ProductsTabContentProps {
  products?: Product[];
  solutionName?: string;
  companyName?: string;
  productDescription?: string;
  solutionDescription?: string;
  solutionCategory?: string[];
  demoLink?: string;
  trialLink?: string;
}

export function ProductsTabContent({
  products,
  solutionName,
  companyName,
  productDescription,
  solutionDescription,
  solutionCategory,
  demoLink,
  trialLink,
}: ProductsTabContentProps) {
  return (
    <div className="space-y-6">
      {/* If products array exists, show all products */}
      {products && products.length > 0 ? (
        products.map((product, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-zinc-900 mb-3">{product.name}</h3>
            <p className="text-zinc-700 mb-4">{product.description}</p>
            {product.category && product.category.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {product.category.map((cat, catIdx) => (
                  <span key={catIdx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                    {cat}
                  </span>
                ))}
              </div>
            )}
            {product.features && product.features.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-zinc-900 mb-2">Key Features</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-zinc-700">
                  {product.features.map((feature, featIdx) => (
                    <li key={featIdx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex gap-3">
              {product.demoLink && (
                <a 
                  href={product.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View Demo
                </a>
              )}
              {product.trialLink && (
                <a 
                  href={product.trialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                  Start Trial
                </a>
              )}
            </div>
          </div>
        ))
      ) : (
        // Fallback to single product from solutionName/solutionDescription
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
          <h3 className="text-xl font-semibold text-zinc-900 mb-3">
            {solutionName || companyName}
          </h3>
          <p className="text-zinc-700 mb-4">
            {productDescription || solutionDescription || "No product description available."}
          </p>
          {solutionCategory && solutionCategory.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {solutionCategory.map((cat, catIdx) => (
                <span key={catIdx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                  {cat}
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            {demoLink && (
              <a 
                href={demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                View Demo
              </a>
            )}
            {trialLink && (
              <a 
                href={trialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors text-sm font-medium"
              >
                Start Trial
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

