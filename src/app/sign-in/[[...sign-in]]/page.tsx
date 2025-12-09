"use client";

import dynamic from "next/dynamic";

const SignIn = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignIn),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-zinc-400">Loading...</div>
      </div>
    ),
  }
);

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Hero Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-50 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-zinc-900">
          <div className="max-w-md">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-blue-100 mb-6">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-sm font-semibold text-blue-700">AI-Powered Healthcare Solutions</span>
              </div>
            </div>
            
            <h1 className="text-5xl xl:text-6xl font-bold mb-6 leading-tight">
              Transforming Healthcare with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600"> AI Innovation</span>
            </h1>
            
            <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
              Access cutting-edge healthcare AI solutions designed to improve patient outcomes, streamline operations, and drive medical innovation.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 mb-1">Advanced AI Diagnostics</h3>
                  <p className="text-sm text-zinc-600">Leverage machine learning for accurate medical insights</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 mb-1">Secure & Compliant</h3>
                  <p className="text-sm text-zinc-600">HIPAA-compliant platform with enterprise-grade security</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 mb-1">Real-Time Analytics</h3>
                  <p className="text-sm text-zinc-600">Make data-driven decisions with instant insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 sm:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">Welcome Back</h1>
            <p className="text-zinc-600">Sign in to access your healthcare AI solutions</p>
          </div>
          
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none bg-transparent border-none",
                cardBox: "shadow-none bg-transparent",
                headerTitle: "text-2xl font-bold text-zinc-900 mb-2",
                headerSubtitle: "text-zinc-600",
                socialButtonsBlockButton: "border border-zinc-200 hover:bg-zinc-50 transition-colors",
                formButtonPrimary: "bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl",
                formFieldInput: "border-zinc-200 focus:border-blue-500 focus:ring-blue-500",
                footerActionLink: "hidden",
                footerAction: "hidden",
                identityPreviewText: "text-zinc-900",
                identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
                footer: "hidden",
                footerPages: "hidden",
                formResendCodeLink: "text-blue-600 hover:text-blue-700",
              },
              layout: {
                socialButtonsPlacement: "top",
              },
            }}
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            redirectUrl="/profile"
          />
          
          <p className="mt-6 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <a href="/sign-up" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

