import { useNavigate } from "react-router-dom";
import { SUBSCRIPTION_PLANS } from "../types";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Check } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { redirectToCheckout } from "../lib/stripe";
import { useToast } from "../components/ui/use-toast";

const tierColors: Record<string, string> = {
  free: "#78909c",
  monthly: "#c9386a",
  annual: "#9b59b6",
  lifetime: "#d4af37",
};

export default function PricingPage() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = async (plan: typeof SUBSCRIPTION_PLANS[0]) => {
    if (!user && !profile) {
      navigate("/register");
      return;
    }
    if (plan.id === "free") return;
    if (!plan.stripePriceId) {
      toast({
        title: "Coming soon",
        description:
          "Payment processing is being set up. Please check back soon!",
      });
      return;
    }
    try {
      await redirectToCheckout(
        plan.stripePriceId,
        user?.id ?? profile?.id ?? "",
        user?.email ?? "",
      );
    } catch {
      toast({
        title: "Error",
        description: "Could not start checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const currentTier = profile?.membership_tier ?? "free";

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
          Swiftie Memberships
        </Badge>
        <h1 className="font-serif text-5xl font-bold text-foreground mb-4">
          Choose Your Era
        </h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          Unlock unlimited posting and exclusive perks. Every plan supports the
          community and keeps the portal ad-free.
        </p>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = currentTier === plan.id;
          const color = tierColors[plan.id];

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 bg-card overflow-hidden flex flex-col transition-all duration-200 hover:shadow-xl ${
                plan.popular
                  ? "border-primary shadow-lg scale-105"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 text-center text-xs font-bold text-white py-1 bg-primary">
                  ⭐ Most Popular
                </div>
              )}

              <div
                className="h-2 w-full"
                style={{ backgroundColor: color }}
              />

              <div className={`p-6 flex-1 flex flex-col ${plan.popular ? "pt-8" : ""}`}>
                <h2
                  className="font-serif text-2xl font-bold mb-1"
                  style={{ color }}
                >
                  {plan.name}
                </h2>

                <div className="mb-4">
                  {plan.price === 0 ? (
                    <span className="text-3xl font-bold text-foreground">
                      Free
                    </span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-foreground">
                        ${plan.price}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        /{plan.interval === "lifetime" ? "once" : plan.interval}
                      </span>
                    </>
                  )}
                  {plan.interval === "year" && (
                    <p className="text-xs text-emerald-600 font-medium mt-1">
                      Save 32% vs monthly
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color }}
                      />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button
                    disabled
                    variant="outline"
                    className="w-full border-2"
                    style={{ borderColor: color, color }}
                  >
                    ✓ Current Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full text-white"
                    style={{ backgroundColor: color }}
                    onClick={() => handleSubscribe(plan)}
                  >
                    {plan.price === 0
                      ? "Get Started Free"
                      : plan.interval === "lifetime"
                      ? "Get Lifetime Access"
                      : `Subscribe · $${plan.price}/${plan.interval === "year" ? "yr" : "mo"}`}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ / Notes */}
      <div className="max-w-2xl mx-auto mt-16 text-center space-y-4">
        <h3 className="font-serif text-2xl font-bold text-foreground">
          Frequently Asked
        </h3>
        <div className="text-left space-y-6 mt-6">
          {[
            {
              q: "Can I cancel anytime?",
              a: "Yes — monthly and annual subscriptions can be cancelled at any time via your profile. You'll retain access until the end of your billing period.",
            },
            {
              q: "What counts as 'original content'?",
              a: "Your own original poems, short stories, and videos inspired by Taylor's work. You may not reproduce her lyrics, melodies, or other copyrighted material.",
            },
            {
              q: "What types of content can I post?",
              a: "Original poems, prose fiction/stories, or videos (via YouTube/Vimeo link). Content must be your own original work.",
            },
            {
              q: "What happens to free members' one post?",
              a: "Free members can post exactly one piece of content. To post more, upgrade to any paid plan.",
            },
          ].map(({ q, a }) => (
            <div key={q}>
              <p className="font-semibold text-foreground">{q}</p>
              <p className="text-muted-foreground text-sm mt-1">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
