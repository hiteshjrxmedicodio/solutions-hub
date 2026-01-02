"use client";

import { useState } from "react";
import { ProductQuestionnaire } from "./ProductQuestionnaire";

interface Product {
  name: string;
  description: string;
  category?: string[];
  features?: string[];
  demoLink?: string;
  trialLink?: string;
}

interface ProductListSectionProps {
  products?: Product[];
  solutionName?: string;
  companyName?: string;
  productDescription?: string;
  solutionDescription?: string;
  solutionCategory?: string[];
  demoLink?: string;
  trialLink?: string;
  onProductAdd?: (product: Product) => void;
}

export function ProductListSection({
  products,
  solutionName,
  companyName,
  productDescription,
  solutionDescription,
  solutionCategory,
  demoLink,
  trialLink,
  onProductAdd,
}: ProductListSectionProps) {
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);

  const handleProductSave = (product: Product) => {
    if (onProductAdd) {
      onProductAdd(product);
    }
    setIsQuestionnaireOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-zinc-900">Products</h2>
        <button
          onClick={() => setIsQuestionnaireOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </button>
      </div>
      
      <div className="space-y-4">
        {/* If products array exists, show all products */}
        {products && products.length > 0 ? (
          products.map((product, idx) => {
            const hasButtons = product.demoLink || product.trialLink;
            return (
              <div key={idx} className={`bg-zinc-50 rounded-lg border border-zinc-200 hover:bg-zinc-100 transition-colors ${hasButtons ? 'p-3' : 'px-3 py-2'}`}>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-base font-semibold text-zinc-900">{product.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
              {product.category && product.category.length > 0 && (
                      <>
                  {product.category.map((cat, catIdx) => (
                          <span key={catIdx} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                        {cat}
                      </span>
                  ))}
                      </>
              )}
              {/* If product doesn't have category but vendor has solutionCategory, show those */}
              {(!product.category || product.category.length === 0) && solutionCategory && solutionCategory.length > 0 && (
                      <>
                  {solutionCategory.map((cat, catIdx) => (
                    <span key={catIdx} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                      {cat}
                    </span>
                  ))}
                      </>
                    )}
                  </div>
                </div>
                {hasButtons && (
                  <div className="flex gap-2 mt-2">
                {product.demoLink && (
                    <a 
                      href={product.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                    >
                      Demo
                    </a>
                )}
                {product.trialLink && (
                    <a 
                      href={product.trialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-xs font-medium"
                    >
                      Trial
                    </a>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          // Fallback to single product from solutionName/solutionDescription
          (() => {
            const hasButtons = demoLink || trialLink;
            return (
              <div className={`bg-zinc-50 rounded-lg border border-zinc-200 ${hasButtons ? 'p-3' : 'px-3 py-2'}`}>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-base font-semibold text-zinc-900">
              {solutionName || companyName || "Product"}
            </h3>
            {solutionCategory && solutionCategory.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                {solutionCategory.map((cat, catIdx) => (
                        <span key={catIdx} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                      {cat}
                    </span>
                ))}
              </div>
            )}
                </div>
                {hasButtons && (
                  <div className="flex gap-2 mt-2">
              {demoLink && (
                  <a 
                    href={demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                  >
                    Demo
                  </a>
              )}
              {trialLink && (
                  <a 
                    href={trialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-xs font-medium"
                  >
                    Trial
                  </a>
              )}
            </div>
                )}
          </div>
            );
          })()
        )}
      </div>

      {/* Product Questionnaire Modal */}
      <ProductQuestionnaire
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        onSave={handleProductSave}
      />
    </div>
  );
}

