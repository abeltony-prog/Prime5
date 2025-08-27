import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Users, Target, Shield, Clock, Zap, AlertTriangle, CheckCircle, Star, Timer, Gamepad2, Trophy } from "lucide-react"

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
    <div className="min-h-screen relative">
      <Navigation />

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-green-500/90 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold mb-6 text-lg shadow-lg">
            Official League Rules
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
            Prime5 League Rules & <span className="text-green-300 drop-shadow-lg">Gamechanger</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-xl">
            Experience futsal like never before with our revolutionary Gamechanger system that transforms the final
            minutes into pure excitement and unpredictability.
          </p>
        </div>

        {/* Gamechanger Introduction */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-green-600/90 to-green-700/90 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 mx-auto">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-2xl">The Gamechanger System</h2>
              <p className="text-xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed drop-shadow-xl">
                A revolutionary twist that activates in the <strong>last 3 minutes of each half</strong>, introducing
                dynamic rule changes that challenge players and electrify spectators. Inspired by innovative formats but
                uniquely Prime5.
              </p>
              <div className="flex items-center justify-center gap-2 text-white/90">
                <Clock className="w-5 h-5" />
                <span className="font-semibold drop-shadow-md">Activates: Final 3 minutes of each half</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Gamechanger Modes */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-2xl">Gamechanger Modes</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-xl">
              One or more of these modes may be activated at random during the Gamechanger period
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {gamechangerModes.map((mode, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${mode.color}`}></div>
                <CardHeader className="text-center pb-4">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${mode.color} rounded-2xl mb-4 mx-auto shadow-lg`}
                  >
                    <mode.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-white drop-shadow-lg">{mode.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <h4 className="font-semibold text-white mb-2 drop-shadow-md">Rule Change:</h4>
                      <p className="text-white/90">{mode.description}</p>
                    </div>
                    <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-4 border border-green-500/30">
                      <h4 className="font-semibold text-green-300 mb-2 drop-shadow-md">Effect:</h4>
                      <p className="text-green-200">{mode.effect}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-2xl">Why the Gamechanger?</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-xl">
              The Gamechanger system serves multiple purposes to enhance the Prime5 League experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {gamechangerPurpose.map((purpose, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl text-center hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-green-500/20 backdrop-blur-sm rounded-2xl mb-6 mx-auto border border-green-500/30">
                    <purpose.icon className="w-8 h-8 text-green-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 drop-shadow-lg">{purpose.title}</h3>
                  <p className="text-white/90 leading-relaxed drop-shadow-md">{purpose.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Standard Rules */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-2xl">Standard Futsal Rules</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-xl">
              Prime5 League follows FIFA Futsal regulations with our unique Gamechanger additions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {standardRules.map((section, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader className="bg-white/20 backdrop-blur-sm border-b border-white/20">
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2 drop-shadow-lg">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    {section.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {section.rules.map((rule, ruleIndex) => (
                      <li key={ruleIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-white/90">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Detailed Match Rules */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-2xl">Detailed Match Rules</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-xl">
              Comprehensive rules and regulations for Prime5 League matches
            </p>
          </div>

          <div className="space-y-8">
            {/* Duration */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-white/20 backdrop-blur-sm border-b border-white/20">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2 drop-shadow-lg">
                  <Clock className="w-5 h-5 text-blue-300" />
                  3.1 Duration
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90"><strong>Match Length:</strong> 2 halves of 20 minutes each</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90"><strong>Half-time:</strong> 5 minutes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90"><strong>No stoppage time</strong> except for serious injuries</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Ball */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-white/20 backdrop-blur-sm border-b border-white/20">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2 drop-shadow-lg">
                  <Target className="w-5 h-5 text-green-300" />
                  3.2 Ball
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90">Official futsal size 4 ball provided by the league</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Kick-off */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-white/20 backdrop-blur-sm border-b border-white/20">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2 drop-shadow-lg">
                  <Zap className="w-5 h-5 text-yellow-300" />
                  3.3 Kick-off
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90">Coin toss determines which team starts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90">Kick-off from center circle at start of halves and after goals</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Substitutions */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-white/20 backdrop-blur-sm border-b border-white/20">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2 drop-shadow-lg">
                  <Users className="w-5 h-5 text-purple-300" />
                  3.4 Substitutions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90">Rolling substitutions allowed at any time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90">Substitution must occur at designated technical zone</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Fouls & Misconduct */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-white/20 backdrop-blur-sm border-b border-white/20">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2 drop-shadow-lg">
                  <Shield className="w-5 h-5 text-red-300" />
                  3.5 Fouls & Misconduct
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90"><strong>5 fouls per half</strong> before awarding a 10-meter free kick to the opposing team</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90"><strong>Yellow and red cards</strong> apply:</span>
                  </li>
                  <li className="flex items-start gap-3 ml-6">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90"><strong>Yellow Card:</strong> 2-minute sin bin</span>
                  </li>
                  <li className="flex items-start gap-3 ml-6">
                    <div className="w-2 h-2 bg-red-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90"><strong>Red Card:</strong> Player ejected, team plays with one less player for 4 minutes or until opponent scores</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Game Changers */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-white/20 backdrop-blur-sm border-b border-white/20">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2 drop-shadow-lg">
                  <Gamepad2 className="w-5 h-5 text-green-300" />
                  4. Game Changers (Baller League Influence)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90">Each team has <strong>1 "Power Play" card</strong> per match:</span>
                  </li>
                  <li className="flex items-start gap-3 ml-6">
                    <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90"><strong>Power Play:</strong> Opponent plays with 4 players for 2 minutes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90"><strong>Fan Vote MVP:</strong> Fans vote after each game; MVP earns points for their team in the season ranking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90"><strong>Double Goal Period:</strong> A 2-minute window (chosen by coach) where all goals count double</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* League Format */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-white/20 backdrop-blur-sm border-b border-white/20">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2 drop-shadow-lg">
                  <Trophy className="w-5 h-5 text-yellow-300" />
                  5. League Format
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90"><strong>Regular Season:</strong> Round-robin, each team plays all others once</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90"><strong>Points System:</strong></span>
                  </li>
                  <li className="flex items-start gap-3 ml-6">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90">Win = 3 points</span>
                  </li>
                  <li className="flex items-start gap-3 ml-6">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90">Draw = 1 point</span>
                  </li>
                  <li className="flex items-start gap-3 ml-6">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90">Loss = 0 points</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90"><strong>Tie-breakers:</strong> Goal difference → Goals scored → Head-to-head</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Final Four Format */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-white/20 backdrop-blur-sm border-b border-white/20">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2 drop-shadow-lg">
                  <Star className="w-5 h-5 text-purple-300" />
                  6. Final Four Format
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90">Top 4 teams after the regular season qualify</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90"><strong>Semi-Finals:</strong> 1st vs 4th, 2nd vs 3rd</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90">Winners advance to the Grand Final</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90">Losers play for 3rd place</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Code of Conduct */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-white/20 backdrop-blur-sm border-b border-white/20">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2 drop-shadow-lg">
                  <Shield className="w-5 h-5 text-blue-300" />
                  7. Code of Conduct
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90">Respect referees, opponents, and officials at all times</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90">Abusive language, fighting, or unsporting behavior will lead to disciplinary action</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/90"><strong>Fair play is at the core of Prime5 League</strong></span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Important Notes */}
        <section className="mb-16">
          <Card className="border-l-4 border-l-yellow-500/50 bg-yellow-500/20 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-yellow-300 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-yellow-200 mb-4 drop-shadow-lg">Important Notes</h3>
                  <ul className="space-y-2 text-yellow-100">
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-2xl">Match Timeline</h2>
            <p className="text-lg text-white/90 drop-shadow-xl">Understanding when the Gamechanger activates during a match</p>
          </div>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden">
            <CardContent className="p-8">
              <div className="relative">
                {/* Timeline */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex-1 h-2 bg-white/20 backdrop-blur-sm rounded-full relative">
                    <div className="absolute left-0 top-0 h-full w-[85%] bg-green-500/90 backdrop-blur-sm rounded-full"></div>
                    <div className="absolute right-0 top-0 h-full w-[15%] bg-red-500/90 backdrop-blur-sm rounded-full"></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="w-4 h-4 bg-green-500/90 backdrop-blur-sm rounded-full mx-auto mb-2"></div>
                    <div className="font-semibold text-white drop-shadow-lg">0-17 minutes</div>
                    <div className="text-sm text-white/80">Standard Rules</div>
                  </div>
                  <div>
                    <div className="w-4 h-4 bg-red-500/90 backdrop-blur-sm rounded-full mx-auto mb-2"></div>
                    <div className="font-semibold text-white drop-shadow-lg">17-20 minutes</div>
                    <div className="text-sm text-white/80">Gamechanger Active</div>
                  </div>
                  <div>
                    <div className="w-4 h-4 bg-white/50 backdrop-blur-sm rounded-full mx-auto mb-2"></div>
                    <div className="font-semibold text-white drop-shadow-lg">Half Time</div>
                    <div className="text-sm text-white/80">2-minute break</div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Badge className="bg-red-500/20 backdrop-blur-md text-red-200 px-4 py-2 rounded-full font-semibold border border-red-500/30">
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
