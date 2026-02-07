# Confidence Score Improvements - Quick Reference

## 🎯 The Problem
**Current Accuracy**: 70-75% (good but not great)
**Main Issue**: Algorithm doesn't handle context, query variety, or learn from feedback

---

## 🔧 Quick Fix Priority List

### 🟢 **DO FIRST (This Week)** - 5-8% Gain
1. **Length-Normalized Jaccard** (30 min)
   - Why: Longer queries unfairly penalized
   - Code: Add boost factor based on query length
   - Gain: +2-3%

2. **Metadata Boosting** (30 min)
   - Why: Specific details = more reliable match
   - Code: Add 2-9% bonus if metadata extracted
   - Gain: +2-3%

3. **Continuous Category Scoring** (1 hour)
   - Why: Current binary match too crude
   - Code: Replace binary with Jaccard similarity for categories
   - Gain: +1-2%

### 🟡 **DO NEXT (This Month)** - Additional 8-10% Gain
4. **Dynamic Synonym Expansion** (4-6 hours)
   - Why: Hardcoded synonyms miss paraphrases
   - Code: Use word embeddings for similar words
   - Gain: +3-5%

5. **Query Specificity Scoring** (3-4 hours)
   - Why: Vague queries need higher threshold to auto-send
   - Code: Score query clarity (length, entities, vague words)
   - Gain: +3-4%

6. **Feedback Collection UI** (6-8 hours)
   - Why: System should learn from corrections
   - Code: Add feedback button, track corrections
   - Gain: +enables continuous improvement

### 🔴 **DO EVENTUALLY (Next 3 Months)** - Additional 10-15% Gain
7. **Ensemble Scoring** (8-12 hours)
   - Why: Multiple models more robust
   - Code: Combine 4 different scoring approaches
   - Gain: +5-8%

8. **Online Learning** (6-8 hours)
   - Why: Learn from repeated mistakes
   - Code: Track correction patterns, adjust scores
   - Gain: +3-5%

9. **Threshold Optimization** (4-6 hours)
   - Why: Thresholds should be data-driven
   - Code: Find optimal thresholds from feedback data
   - Gain: +3-5%

10. **Temporal Sensitivity** (3-4 hours)
    - Why: Registration questions more relevant in reg season
    - Code: Boost confidence based on academic calendar
    - Gain: +2-3%

---

## 📊 Current Algorithm (High Level)

```
Query: "I need to register for Spring 2025 courses"
          ↓
  50% Jaccard similarity with "register" utterances
+ 20% Token coverage (how much of query matches utterance)
+ 20% TF-IDF semantic similarity
+ 10% Category overlap
────────────────────────────────
= Base confidence
  ↓
Apply thresholds:
- Exact match? → 100%
- Jaccard ≥ 0.85? → at least 92%
- Jaccard ≥ 0.70? → at least 85%
  ↓
Final confidence: 0.0-1.0
```

---

## ❌ Known Issues

| Issue | Impact | Fix Effort | Priority |
|-------|--------|-----------|----------|
| Query length bias | Longer queries get lower scores | 30 min | 🔴 Critical |
| No context understanding | Can't distinguish "help with course" meanings | 4+ hours | 🟠 High |
| Metadata ignored | Extracted data doesn't affect confidence | 30 min | 🟠 High |
| Limited synonyms | Only 30 hardcoded, misses variations | 4 hours | 🟠 High |
| No learning | System doesn't learn from corrections | 6+ hours | 🟠 High |
| Unbalanced articles | Articles with more utterances favored | 2 hours | 🟡 Medium |
| Static thresholds | No adaptation to query types | 4 hours | 🟡 Medium |
| Vague queries over-confident | "Help" scores same as "Register for Fall" | 3 hours | 🟡 Medium |

---

## 💡 Implementation Examples

### 1️⃣ Length-Normalized Jaccard (Copy-Paste Ready)
```python
def improved_jaccard_similarity(query_tokens, utterance_tokens):
    """Jaccard adjusted for query length"""
    q_set = set(query_tokens)
    u_set = set(utterance_tokens)
    intersection = len(q_set & u_set)
    union = len(q_set | u_set)

    base_jaccard = intersection / union if union > 0 else 0

    # Boost for short, clear queries
    if len(query_tokens) < 5:
        boost = 1.1  # 10% confidence boost
    elif len(query_tokens) > 20:
        boost = 0.95  # Penalty for verbose
    else:
        boost = 1.0

    return min(base_jaccard * boost, 1.0)
```

### 2️⃣ Metadata Confidence Boost (Copy-Paste Ready)
```python
def apply_metadata_confidence_boost(base_confidence, metadata_facts):
    """Boost confidence when metadata is extracted"""
    bonus = 0.0

    # Student name found = +3%
    if any(f.key == "student_name" for f in metadata_facts):
        bonus += 0.03

    # Term/deadline found = +4%
    if any(f.key in ["term", "registration_deadline"] for f in metadata_facts):
        bonus += 0.04

    # Multiple facts = +2%
    if len(metadata_facts) >= 3:
        bonus += 0.02

    return min(base_confidence + bonus, 0.97)
```

### 3️⃣ Query Specificity (Copy-Paste Ready)
```python
def calculate_specificity_score(query_tokens, query_text):
    """Rate query clarity (0-1)"""
    import re

    # Long queries are usually more specific
    length_score = min(len(query_tokens) / 10, 1.0)

    # Named entities = specific
    has_date = bool(re.search(r'\d{1,2}[-/]\d{1,2}', query_text))
    has_course = bool(re.search(r'[A-Z]{1,4}\s*\d{4}', query_text))
    entity_score = (has_date + has_course) / 2

    # Vague words = less clear
    vague_words = {'thing', 'stuff', 'help', 'issue'}
    vague_count = sum(1 for t in query_tokens if t in vague_words)
    clarity_score = 1 - (vague_count / len(query_tokens))

    # Combine
    return 0.4 * length_score + 0.4 * entity_score + 0.2 * clarity_score

# Then adjust confidence:
specificity = calculate_specificity_score(query_tokens, query)
if specificity > 0.7:  # Very specific
    final_confidence = min(base_confidence * 1.05, 0.97)  # +5%
elif specificity < 0.3:  # Vague
    final_confidence = max(base_confidence * 0.90, 0.05)  # -10%
```

---

## 📈 Expected Results

### Phase 1 (1-2 weeks)
```
Current:   75%
After:     80-83%
Gain:      +5-8%

Changes:
- Length normalization
- Metadata boosting
- Category scoring
```

### Phase 2 (2-4 weeks)
```
Current:   80-83%
After:     85-88%
Gain:      +5-8% (cumulative +10-15%)

Changes:
- Dynamic synonyms
- Specificity scoring
- Feedback collection
```

### Phase 3 (4-12 weeks)
```
Current:   85-88%
After:     90-95%
Gain:      +5-10% (cumulative +20-25%)

Changes:
- Ensemble scoring
- Online learning
- Threshold optimization
- Temporal awareness
```

---

## 🚀 Where to Make Changes

**Main File**: `/Users/dd226/ieor-email-reply/Backend/email_advising/advisor.py`

**Key Functions** to modify:
- Line 110-243: `rank_articles()` - Main scoring logic
- Line 220-225: Confidence blending formula
- Line 226-236: Threshold application

**Supporting Files**:
- `text_processing.py` - Add dynamic synonym expansion
- `models.py` - Add ConfidenceSettings adjustments
- `similarity.py` - Modify TF-IDF handling
- `api.py` - Add feedback endpoints

---

## 📋 Testing Strategy

### Before & After Comparison
```python
# Test current vs improved
test_queries = [
    "How do I register for spring?",  # Simple
    "I'm struggling with my course load and might need to drop one...",  # Complex
    "Help with deadline",  # Vague
    "I need to withdraw from IEOR 3900 before Oct 15",  # Specific
]

for query in test_queries:
    old_score = score_with_current_algorithm(query)
    new_score = score_with_improvements(query)
    print(f"{query}\nBefore: {old_score:.2f} → After: {new_score:.2f}\n")
```

### Validation with Historical Data
```python
# If you have 100+ emails with known correct articles:
# 1. Score each with current algorithm
# 2. Score with new algorithm
# 3. Calculate accuracy on known correct answers
# 4. Compare improvement

accuracy_before = accuracy_with_current(historical_emails)
accuracy_after = accuracy_with_new(historical_emails)

print(f"Accuracy improvement: {accuracy_before:.1%} → {accuracy_after:.1%}")
```

---

## ❓ FAQ

**Q: Should I implement all 12 recommendations?**
A: No. Start with Phase 1 (quick wins). Then decide based on results.

**Q: How do I know if improvement is working?**
A: Track auto-send accuracy over time. With feedback collection, you'll have real data.

**Q: Will changes break existing functionality?**
A: If you update only the scoring function (lines 220-236), no breaking changes.

**Q: What's the risk?**
A: Low. Changes only affect confidence scores, not routing logic. Can always revert.

**Q: How much will this take?**
A: Phase 1: 2 hours. Phase 2: 1-2 weeks. Phase 3: 4-8 weeks (but iterative gains).

**Q: Can I use ML/AI libraries?**
A: Yes, but note: current system uses lightweight custom code. Adding sklearn/TensorFlow adds dependencies. Optional.

---

## 🎯 Next Steps

1. **Read Full Analysis** → CONFIDENCE_SCORE_ANALYSIS.md
2. **Pick Phase 1 improvements** → Implement length normalization, metadata boost
3. **Test & Measure** → Compare scores on historical emails
4. **Deploy carefully** → Roll out to 10% of traffic first, monitor
5. **Collect feedback** → Use improved UI to gather correction data
6. **Iterate** → Use Phase 2 improvements based on feedback patterns

---

**Last Updated**: 2026-02-07
**Confidence Analysis**: Complete
**Recommendations**: 12 total (3 phases)
**Expected Timeline**: 3-6 months to 90%+ accuracy

