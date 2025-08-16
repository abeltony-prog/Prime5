import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Users, Target, Shield, Clock, Zap, AlertTriangle, CheckCircle, Star, Timer, Gamepad2 } from "lucide-react"

export default function RulesPage() {
  const gamechangerModes = [
    {
      title: "3v3 Showdown",
      icon: Users,
      description: "Teams must reduce to 3 outfield players + goalkeeper",
      effect: "Creates more space and opportunities for quick goals",
      color: "from-red-500 to-orange-500",
    },
    {
      title: "Double Points for Long-Range Goals",
      icon: Target,
      description: "Any goal scored outside the marked scoring zone counts as 2 goals",
      effect: "Encourages risk-taking and spectacular strikes",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Goalkeeper Restrictions",
      icon: Shield,
      description: "Goalkeepers cannot use their hands – only feet allowed",
      effect: "Forces creative defending and keeps the tension high",
      color: "from-purple-500 to-pink-500",
    },
  ]

  const standardRules = [
    {
      category: "Team Composition",
      rules: [
        "5 players per team on the court (4 outfield + 1 goalkeeper)",
        "Maximum 12 players per squad",
        "Unlimited substitutions during play",
        "Substitutions must occur in designated areas",
      ],
    },
    {
      category: "Match Duration",
      rules: [
        "Two halves of 20 minutes each",
        "Running clock (stops only for timeouts)",
        "2-minute break between halves",
        "Gamechanger activates in final 3 minutes of each half",
      ],
    },
    {
      category: "Court & Equipment",
      rules: [
        "Court size: 40m x 20m (FIFA Futsal standard)",
        "Goals: 3m x 2m",
        "Ball: Size 4, low bounce futsal ball",
        "Players must wear shin guards and non-marking shoes",
      ],
    },
    {
      category: "Gameplay Rules",
      rules: [
        "Kick-ins instead of throw-ins",
        "4-second rule for kick-ins, corner kicks, and free kicks",
        "Goalkeeper has 4 seconds to release the ball",
        "Back-pass rule: goalkeeper cannot pick up deliberate back-pass",
      ],
    },
  ]

  const gamechangerPurpose = [
    {
      title: "Entertainment Value",
      description: "Boost excitement for fans in the arena and online viewers",
      icon: Star,
    },
    {
      title: "Player Adaptability",
      description: "Test strategy and adaptability of players under pressure",
      icon: Gamepad2,
    },
    {
      title: "Match Intensity",
      description: "Ensure every match stays alive until the final whistle",
      icon: Zap,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-800 px-6 py-3 rounded-full font-semibold mb-6 text-lg">
            Official League Rules
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Prime5 League Rules & <span className="text-green-600">Gamechanger</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience futsal like never before with our revolutionary Gamechanger system that transforms the final
            minutes into pure excitement and unpredictability.
          </p>
        </div>

        {/* Gamechanger Introduction */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-green-600 to-green-700 border-0 shadow-2xl">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 mx-auto">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Gamechanger System</h2>
              <p className="text-xl text-green-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                A revolutionary twist that activates in the <strong>last 3 minutes of each half</strong>, introducing
                dynamic rule changes that challenge players and electrify spectators. Inspired by innovative formats but
                uniquely Prime5.
              </p>
              <div className="flex items-center justify-center gap-2 text-green-100">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Activates: Final 3 minutes of each half</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Gamechanger Modes */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Gamechanger Modes</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              One or more of these modes may be activated at random during the Gamechanger period
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {gamechangerModes.map((mode, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${mode.color}`}></div>
                <CardHeader className="text-center pb-4">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${mode.color} rounded-2xl mb-4 mx-auto shadow-lg`}
                  >
                    <mode.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{mode.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Rule Change:</h4>
                      <p className="text-gray-700">{mode.description}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Effect:</h4>
                      <p className="text-green-700">{mode.effect}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Purpose of Gamechanger */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why the Gamechanger?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The Gamechanger system serves multiple purposes to enhance the Prime5 League experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {gamechangerPurpose.map((purpose, index) => (
              <Card key={index} className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6 mx-auto">
                    <purpose.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{purpose.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{purpose.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Standard Rules */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Standard Futsal Rules</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Prime5 League follows FIFA Futsal regulations with our unique Gamechanger additions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {standardRules.map((section, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    {section.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {section.rules.map((rule, ruleIndex) => (
                      <li key={ruleIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Important Notes */}
        <section className="mb-16">
          <Card className="border-l-4 border-l-yellow-500 bg-yellow-50 border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-yellow-800 mb-4">Important Notes</h3>
                  <ul className="space-y-2 text-yellow-700">
                    <li>• Gamechanger modes are selected randomly by match officials</li>
                    <li>• Multiple modes can be active simultaneously</li>
                    <li>• Teams are notified when Gamechanger period begins</li>
                    <li>• Standard futsal rules apply outside of Gamechanger periods</li>
                    <li>• Match officials have final authority on all rule interpretations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Timeline */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Match Timeline</h2>
            <p className="text-lg text-gray-600">Understanding when the Gamechanger activates during a match</p>
          </div>

          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-8">
              <div className="relative">
                {/* Timeline */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full relative">
                    <div className="absolute left-0 top-0 h-full w-[85%] bg-green-500 rounded-full"></div>
                    <div className="absolute right-0 top-0 h-full w-[15%] bg-red-500 rounded-full"></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <div className="font-semibold text-gray-900">0-17 minutes</div>
                    <div className="text-sm text-gray-600">Standard Rules</div>
                  </div>
                  <div>
                    <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
                    <div className="font-semibold text-gray-900">17-20 minutes</div>
                    <div className="text-sm text-gray-600">Gamechanger Active</div>
                  </div>
                  <div>
                    <div className="w-4 h-4 bg-gray-400 rounded-full mx-auto mb-2"></div>
                    <div className="font-semibold text-gray-900">Half Time</div>
                    <div className="text-sm text-gray-600">2-minute break</div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Badge className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold">
                    <Timer className="w-4 h-4 mr-2" />
                    Same pattern repeats in second half (37-40 minutes)
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
