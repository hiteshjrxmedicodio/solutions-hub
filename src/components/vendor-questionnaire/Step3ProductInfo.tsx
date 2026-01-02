"use client";

import { useMemo } from "react";
import { VendorStepProps } from "./types";
import { FormField, Input, Textarea } from "../questionnaire/FormField";

const MIN_OVERVIEW_LENGTH = 50;
const MAX_OVERVIEW_LENGTH = 2000;

export const Step3ProductInfo = ({ formData, updateField, errors = {}, touchedFields = new Set() }: VendorStepProps) => {
  const getFieldError = (field: string, index?: number) => {
    const fieldKey = index !== undefined ? `${field}.${index}` : field;
    return touchedFields.has(fieldKey) ? errors[fieldKey] : undefined;
  };

  const products = formData.products || [];

  const addProduct = () => {
    const newProducts = [...products, { name: "", overview: "", url: "" }];
    updateField("products", newProducts);
  };

  const removeProduct = (index: number) => {
    const newProducts = products.filter((_, i) => i !== index);
    updateField("products", newProducts);
  };

  const updateProduct = (index: number, field: "name" | "overview" | "url", value: string) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    updateField("products", newProducts);
  };

  const getOverviewCharCount = (overview: string | undefined) => {
    const overviewStr = overview || "";
    const length = overviewStr.length;
    const remaining = MAX_OVERVIEW_LENGTH - length;
    return {
      current: length,
      max: MAX_OVERVIEW_LENGTH,
      remaining,
      isWarning: remaining < 100,
      isError: remaining < 0,
    };
  };

  // Get the first product (primary product)
  const primaryProduct = products[0] || { name: "", overview: "", url: "" };
  // Ensure overview is always a string
  const primaryProductOverview = primaryProduct.overview || "";
  const additionalProducts = products.slice(1);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-zinc-900">Product Information</h3>
          <button
            type="button"
            onClick={addProduct}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
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
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Add Product
          </button>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Share details about your products or solutions. Add multiple products if needed.
        </p>
      </div>

      <div className="space-y-5">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 space-y-5">
            <FormField 
              label="Product Name" 
              required
              error={getFieldError("products", 0)}
            >
              <Input
                type="text"
                name="productName-0"
                data-field="products.0.name"
                value={primaryProduct.name}
                onChange={(e) => updateProduct(0, "name", e.target.value)}
                placeholder="The name of your product or solution"
                required
                error={!!getFieldError("products", 0)}
              />
            </FormField>

            <FormField 
              label="Product Overview" 
              required
              error={getFieldError("products.0.overview")}
            >
              <div className="relative">
                <Textarea
                  name="productOverview-0"
                  data-field="products.0.overview"
                  value={primaryProductOverview}
                  onChange={(e) => updateProduct(0, "overview", e.target.value)}
                  placeholder="Describe your product, its key features, target use cases, and how it helps healthcare institutions improve their operations..."
                  required
                  error={!!getFieldError("products.0.overview") || getOverviewCharCount(primaryProductOverview).isError}
                  className="pr-20"
                  autoResize={true}
                />
                <div className={`absolute bottom-3 right-3 text-xs font-medium px-2 py-1 rounded ${
                  getOverviewCharCount(primaryProductOverview).isError
                    ? "bg-red-100 text-red-700"
                    : getOverviewCharCount(primaryProductOverview).isWarning
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-zinc-100 text-zinc-600"
                }`}>
                  {getOverviewCharCount(primaryProductOverview).current} / {getOverviewCharCount(primaryProductOverview).max}
                </div>
              </div>
              {primaryProductOverview.length > 0 && primaryProductOverview.length < MIN_OVERVIEW_LENGTH && (
                <p className="mt-1 text-xs text-amber-600">
                  {MIN_OVERVIEW_LENGTH - primaryProductOverview.length} more characters needed
                </p>
              )}
            </FormField>

            <FormField 
              label="Product URL" 
            >
              <Input
                type="url"
                name="productUrl-0"
                data-field="products.0.url"
                value={primaryProduct.url || ""}
                onChange={(e) => updateProduct(0, "url", e.target.value)}
                placeholder="Optional: Direct link to the product page or documentation"
                error={false}
              />
            </FormField>
          </div>

          {/* Additional Products */}
          {additionalProducts.length > 0 && (
            <div className="space-y-4">
              {additionalProducts.map((product, index) => {
                const actualIndex = index + 1;
                const productOverview = product.overview || "";
                const overviewCharCount = getOverviewCharCount(productOverview);
                const overviewLength = productOverview.length;

                return (
                  <div key={actualIndex} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 space-y-5">
                    <div className="flex items-center justify-end pb-4 border-b border-zinc-100">
                      <button
                        type="button"
                        onClick={() => removeProduct(actualIndex)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5 transition-colors"
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
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                        Remove
                      </button>
                    </div>

                    <FormField 
                      label="Product Name" 
                      required
                      error={getFieldError("products", actualIndex)}
                    >
                      <Input
                        type="text"
                        name={`productName-${actualIndex}`}
                        data-field={`products.${actualIndex}.name`}
                        value={product.name}
                        onChange={(e) => updateProduct(actualIndex, "name", e.target.value)}
                        placeholder="The name of your product or solution"
                        required
                        error={!!getFieldError("products", actualIndex)}
                      />
                    </FormField>

                    <FormField 
                      label="Product Overview" 
                      required
                      error={getFieldError(`products.${actualIndex}.overview`)}
                    >
                      <div className="relative">
                        <Textarea
                          name={`productOverview-${actualIndex}`}
                          data-field={`products.${actualIndex}.overview`}
                          value={productOverview}
                          onChange={(e) => updateProduct(actualIndex, "overview", e.target.value)}
                          placeholder="Describe your product, its key features, target use cases, and how it helps healthcare institutions improve their operations..."
                          required
                          error={!!getFieldError(`products.${actualIndex}.overview`) || overviewCharCount.isError}
                          className="pr-20"
                          autoResize={true}
                        />
                        <div className={`absolute bottom-3 right-3 text-xs font-medium px-2 py-1 rounded ${
                          overviewCharCount.isError
                            ? "bg-red-100 text-red-700"
                            : overviewCharCount.isWarning
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-zinc-100 text-zinc-600"
                        }`}>
                          {overviewCharCount.current} / {overviewCharCount.max}
                        </div>
                      </div>
                      {overviewLength > 0 && overviewLength < MIN_OVERVIEW_LENGTH && (
                        <p className="mt-1 text-xs text-amber-600">
                          {MIN_OVERVIEW_LENGTH - overviewLength} more characters needed
                        </p>
                      )}
                    </FormField>

                    <FormField 
                      label="Product URL" 
                    >
                      <Input
                        type="url"
                        name={`productUrl-${actualIndex}`}
                        data-field={`products.${actualIndex}.url`}
                        value={product.url || ""}
                        onChange={(e) => updateProduct(actualIndex, "url", e.target.value)}
                        placeholder="Optional: Direct link to the product page or documentation"
                        error={false}
                      />
                    </FormField>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
};
