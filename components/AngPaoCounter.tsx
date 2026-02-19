import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, RotateCcw, Undo2, Moon, Sun } from "lucide-react";

const DENOMS = [100, 50, 10, 5, 2];

function currency(n: number) {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function AngPaoCounterApp() {
  const [dark, setDark] = useState(false);
  const [counts, setCounts] = useState<Record<number, number>>(() =>
    Object.fromEntries(DENOMS.map((d) => [d, 0])) as Record<number, number>
  );
  const [history, setHistory] = useState<number[]>([]);

  const total = useMemo(() => {
    return DENOMS.reduce((sum, d) => sum + d * (counts[d] ?? 0), 0);
  }, [counts]);

  const totalPackets = useMemo(() => {
    return DENOMS.reduce((sum, d) => sum + (counts[d] ?? 0), 0);
  }, [counts]);

  function add(d: number) {
    setCounts((prev) => ({ ...prev, [d]: (prev[d] ?? 0) + 1 }));
    setHistory((h) => [d, ...h].slice(0, 50));
  }

  function undo() {
    setHistory((h) => {
      if (!h.length) return h;
      const [last, ...rest] = h;
      setCounts((prev) => ({
        ...prev,
        [last]: Math.max(0, (prev[last] ?? 0) - 1),
      }));
      return rest;
    });
  }

  function reset() {
    setCounts(
      Object.fromEntries(DENOMS.map((d) => [d, 0])) as Record<number, number>
    );
    setHistory([]);
  }

  const red = "#da2929";

  // Theming
  const pageBg = dark ? "bg-zinc-950" : "bg-white";
  const cardBg = dark ? "bg-zinc-900" : "bg-white";
  const cardBorder = dark ? "border-zinc-800" : "border-zinc-200";
  const subtleBorder = dark ? "border-zinc-800" : "border-zinc-200";
  const textPrimary = dark ? "text-zinc-100" : "text-zinc-950";
  const textSecondary = dark ? "text-zinc-400" : "text-zinc-600";
  const textMuted = dark ? "text-zinc-500" : "text-zinc-500";
  const divider = dark ? "bg-zinc-800" : "bg-zinc-200";
  const pillBorder = dark ? "border-zinc-800" : "border-zinc-200";
  const outlineBtn = dark
    ? "border-zinc-700 text-zinc-100 bg-zinc-900 hover:bg-zinc-800"
    : "border-zinc-200 text-zinc-900 bg-white hover:bg-zinc-50";

  return (
    <div className={`min-h-screen ${pageBg} ${dark ? "text-zinc-100" : ""}`}>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${pillBorder}`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: red }}
              />
              <span className={dark ? "text-zinc-300" : "text-zinc-700"}>
                CNY Ang Pao Counter
              </span>
            </div>
            <h1
              className={`mt-3 text-3xl font-semibold tracking-tight ${textPrimary}`}
            >
              Count your red packets
            </h1>
            <p className={`mt-1 text-sm ${textSecondary}`}>
              Tap a denomination to add one packet. Keep an eye on your running
              distribution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setDark((d) => !d)}
              className={`rounded-2xl ${outlineBtn}`}
              title="Toggle dark mode"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              onClick={undo}
              disabled={!history.length}
              className={`rounded-2xl ${outlineBtn}`}
              title="Undo last"
            >
              <Undo2 className="mr-2 h-4 w-4" />
              Undo
            </Button>
            <Button
              variant="outline"
              onClick={reset}
              className={`rounded-2xl ${outlineBtn}`}
              title="Reset"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Total */}
          <Card className={`rounded-3xl ${cardBorder} ${cardBg}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-sm ${textSecondary}`}>Total amount</div>
                  <div
                    className="mt-2 text-5xl font-semibold tracking-tight"
                    style={{ color: red }}
                  >
                    {currency(total)}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${textSecondary}`}>Dollar Bils</div>
                  <div className={`mt-2 text-2xl font-semibold ${textPrimary}`}>
                    {totalPackets}
                  </div>
                </div>
              </div>

              <Separator className={`my-5 ${divider}`} />

              <div className="grid grid-cols-2 gap-3">
                {DENOMS.map((d) => (
                  <Button
                    key={d}
                    onClick={() => add(d)}
                    className="h-14 rounded-2xl text-base font-semibold"
                    style={{
                      backgroundColor: red,
                      color: "white",
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {currency(d)}
                  </Button>
                ))}
              </div>

              <p className={`mt-4 text-xs ${textMuted}`}>
                Tip: Use Undo if you mis-tapped. History keeps the last 50 taps.
              </p>
            </CardContent>
          </Card>

          {/* Distribution */}
          <Card className={`rounded-3xl ${cardBorder} ${cardBg}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`mt-1 text-xl font-semibold ${textPrimary}`}>
                    Bills Distribution
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="rounded-full"
                  style={{ borderColor: `${red}55`, color: red }}
                >
                  Live
                </Badge>
              </div>

              <Separator className={`my-5 ${divider}`} />

              <div className="space-y-4">
                {DENOMS.map((d) => {
                  const c = counts[d] ?? 0;
                  const subtotal = d * c;
                  const pct = total > 0 ? (subtotal / total) * 100 : 0;
                  return (
                    <div
                      key={d}
                      className={`rounded-2xl border p-4 ${subtleBorder} ${dark ? "bg-zinc-950/30" : "bg-white"}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className={`text-base font-semibold ${textPrimary}`}>
                              {currency(d)}
                            </div>
                            <Badge
                              className="rounded-full"
                              style={{
                                backgroundColor: `${red}14`,
                                color: red,
                              }}
                            >
                              x{c}
                            </Badge>
                          </div>
                          <div className={`mt-1 text-sm ${textSecondary}`}>
                            Subtotal:{" "}
                            <span className={`font-medium ${textPrimary}`}>
                              {currency(subtotal)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${textPrimary}`}>
                            {pct.toFixed(0)}%
                          </div>
                        </div>
                      </div>

                      <div
                        className={`mt-3 h-2 w-full rounded-full ${
                          dark ? "bg-zinc-800" : "bg-zinc-100"
                        }`}
                      >
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${Math.max(0, Math.min(100, pct))}%`,
                            backgroundColor: red,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator className={`my-5 ${divider}`} />

              <div>
                <div className={`text-sm ${textSecondary}`}>Recent taps</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {history.length ? (
                    history.slice(0, 12).map((d, idx) => (
                      <Badge
                        key={`${d}-${idx}`}
                        variant="outline"
                        className="rounded-full"
                        style={{ borderColor: `${red}55`, color: red }}
                      >
                        +{currency(d)}
                      </Badge>
                    ))
                  ) : (
                    <span className={`text-sm ${textMuted}`}>No taps yet.</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Separator className={`my-5 ${divider}`} />
        <footer className={`text-xs ${textMuted}`}>
          built by <a
          className="underline"
            href="jormy.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            >jorm</a>
        </footer>
      </div>
    </div>
  );
}
