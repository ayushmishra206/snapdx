import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Zap, LogOut, MessageSquare, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const handleSignOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">SnapDx</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:block">
              {profile?.email}
            </span>
            <form action={handleSignOut}>
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-primary to-primary-600 text-white rounded-xl p-8 mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {profile?.full_name || "there"}! 👋
            </h1>
            <p className="text-primary-100 text-lg">
              Ready to learn some orthopedics? Start a new case or continue where you left off.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">Cases Analyzed</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{profile?.usage_count || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Total image analyses</p>
            </div>

            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Status</h3>
              </div>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {profile?.specialization?.replace("_", " ") || "Student"}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {profile?.institution || "No institution set"}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Account</h3>
              </div>
              <p className="text-lg font-semibold text-green-600">Free Tier</p>
              <p className="text-sm text-gray-600 mt-1">
                {10 - (profile?.usage_count || 0)} analyses left this month
              </p>
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="bg-white rounded-xl p-12 border text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Chat Interface Coming Soon!</h2>
              <p className="text-gray-600 mb-6">
                We're working hard to bring you the full SnapDx experience. The chat interface 
                with image upload and AI analysis will be available in the next sprint.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/profile">
                  <Button variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Educational Disclaimer */}
          <div className="mt-8 border-l-4 border-accent-500 bg-accent-50 p-4 rounded-r-lg">
            <p className="text-sm text-accent-900">
              <strong>⚠️ Educational Tool Only:</strong> SnapDx is for learning purposes and is NOT a medical device. 
              Do not use for clinical diagnosis or treatment decisions. Always consult a qualified healthcare professional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
