"use client";

import React, { useActionState, Suspense } from "react";
import { loginAction, signupAction, type AuthState } from "@/app/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [loginState, loginFormAction, loginPending] = useActionState<
    AuthState | null,
    FormData
  >(loginAction, null);

  const [signupState, signupFormAction, signupPending] = useActionState<
    AuthState | null,
    FormData
  >(signupAction, null);

  const [isSignup, setIsSignup] = React.useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {isSignup ? "サインアップ" : "ログイン"}
          </h1>
          <p className="text-gray-400">
            {isSignup
              ? "Netflixアカウントを作成"
              : "Netflixアカウントにログイン"}
          </p>
        </div>

        <form
          action={isSignup ? signupFormAction : loginFormAction}
          className="space-y-4"
        >
          <input type="hidden" name="redirect" value={redirect} />

          {isSignup && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                名前
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                className="bg-gray-900 text-white border-gray-700"
                placeholder="お名前を入力"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              メールアドレス
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="bg-gray-900 text-white border-gray-700"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              パスワード
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="bg-gray-900 text-white border-gray-700"
              placeholder="パスワードを入力"
            />
          </div>

          {(loginState?.error || signupState?.error) && (
            <div className="p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
              {loginState?.error || signupState?.error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loginPending || signupPending}
            className="w-full bg-netflix-red hover:bg-netflix-red/90 text-white"
          >
            {loginPending || signupPending
              ? "処理中..."
              : isSignup
              ? "サインアップ"
              : "ログイン"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-gray-400 hover:text-white text-sm"
          >
            {isSignup
              ? "既にアカウントをお持ちですか？ログイン"
              : "アカウントをお持ちでない方はサインアップ"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-white">読み込み中...</div>}>
      <LoginForm />
    </Suspense>
  );
}

