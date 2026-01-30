def analyze_typing(total_time, total_keys, backspace_count, pause_count):
    """
    Analyze typing behavior to provide early risk indicators.
    This is NOT a medical diagnosis.
    """

    # Safety check
    if total_time == 0 or total_keys == 0:
        return {
            "risk_level": "Insufficient Data",
            "reasons": ["Typing data is incomplete"]
        }

    # Feature extraction
    typing_speed = total_keys / total_time          # characters per second
    correction_rate = backspace_count / total_keys  # percentage of corrections

    score = 0
    reasons = []

    # Rule-based analysis (heuristics)
    if typing_speed < 1:
        score += 1
        reasons.append("Slow typing speed")

    if correction_rate > 0.25:
        score += 1
        reasons.append("Frequent corrections")

    if pause_count >= 6:
        score += 1
        reasons.append("Frequent pauses while typing")

    # Final risk decision
    if score == 0:
        risk_level = "Low Risk"
    elif score == 1:
        risk_level = "Mild Risk"
    else:
        risk_level = "Needs Attention"

    return {
        "risk_level": risk_level,
        "typing_speed": round(typing_speed, 2),
        "correction_rate": round(correction_rate, 2),
        "pause_count": pause_count,
        "reasons": reasons
    }
result = analyze_typing(
    total_time=25,
    total_keys=40,
    backspace_count=12,
    pause_count=8
)

print("Risk Level:", result["risk_level"])
print("Reasons:")
for r in result["reasons"]:
    print("-", r)
