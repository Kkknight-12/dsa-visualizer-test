# 🧩 LeetCode 31: Next Permutation

## 📌 Problem Statement
Ek array `nums` diya gaya hai jo integers ko represent karta hai. Aapko `nums` ka **Next Lexicographically Greater Permutation** in-place compute karna hai.

Agar array ka koi next greater permutation possible nahi hai (matlab array already fully descending order me hai, like `[3, 2, 1]`), toh array ko lowest possible order me rearrange karna hai (i.e., sorted in ascending order `[1, 2, 3]`).

> **Constraint**: Modifications must be made **in-place** with **O(1) extra memory**.

---

### 💡 Examples

| Input Array `nums` | Next Permutation | Explanation |
| :--- | :--- | :--- |
| `[1, 2, 3]` | `[1, 3, 2]` | Lexicographically next sequence. |
| `[3, 2, 1]` | `[1, 2, 3]` | Last permutation! Reverses back to first permutation. |
| `[1, 1, 5]` | `[1, 5, 1]` | Next greater arrangement. |
| `[1, 3, 5, 4, 2]` | `[1, 4, 2, 3, 5]` | Breakpoint `i=1` (val=3), swap with `j=3` (val=4), reverse suffix `[5, 3, 2]` -> `[2, 3, 5]`. |

---

## 🔍 Visualizing Lexicographical Order & Suffix Trend

Lexicographical order me number ki value increase hoti hai jab hum RIGHT side ke peak elements ko modify karne ke bajaye sabse PEHLE (leftmost) small element ko right side se aane wale just-greater element se swap karte hain.

```
Array:  [1, 3, 5, 4, 2]
           ↑  └───────┘
        Pivot    Descending Suffix (Peak at 5)
```

---

## 🚀 Approaches Breakdown

### 1. 🐢 Brute Force Approach
- **Logic**:
  1. Recursion / Backtracking use karke array ke saare possible \(N!\) permutations generate karo.
  2. Saare permutations ko sorted order me store karo.
  3. Given array `nums` ki location search karo.
  4. Agla (next) permutation pick karo. Agar given array last element hai, toh 0th index ka array select karo.
- **Complexity**:
  - **Time Complexity**: \(O(N! \cdot N)\) — Super slow! Impossible for \(N > 10\).
  - **Space Complexity**: \(O(N! \cdot N)\) — Memory limit exceeded.

---

### 2. ⚡ Better Approach (Library Function & Suffix Scan)
- **Logic**:
  - C++ `std::next_permutation(nums.begin(), nums.end())` jaisa internal algorithm execute karna.
  - Right to left scan karke single pass me swap and reverse index calculate karna.
- **Complexity**:
  - **Time Complexity**: \(O(N)\)
  - **Space Complexity**: \(O(1)\)

---

### 3. 🔥 Optimal Approach (In-Place 3-Step Lexicographical Pivot Algorithm)

Yeh algorithm 3 simple steps me kaam karta hai:

#### **Step 1: Find Pivot / Breakpoint `i`**
Right se left travel karo (`n-2` to `0`) aur sabse pehla index `i` dhoondo jahan `nums[i] < nums[i+1]`.
*(Yeh index batata hai ki kahan tak array strictly increasing from right (descending) peak bana raha tha).*

> **Edge Case**: Agar aisa koi index `i` nahi milta (i.e. `i < 0`), iska matlab poora array descending order me hai (like `[5, 4, 3, 2, 1]`). Iss case me poore array ko reverse karke `[1, 2, 3, 4, 5]` bana do aur return kar do.

#### **Step 2: Find Just Greater Element `j`**
Agar pivot `i` mil gaya hai, toh dubara right se left scan karo (`n-1` to `i+1`) aur sabse pehla element `nums[j]` dhoondo jo `nums[i]` se BADA ho (`nums[j] > nums[i]`).

#### **Step 3: Swap & Reverse Suffix**
1. `nums[i]` aur `nums[j]` ko **swap** karo.
2. Index `i + 1` se leke `n - 1` tak ke saare elements ko **reverse** kar do.
   *(Kyunki suffix already descending order me tha, reverse karne par woh smallest ascending order me converted ho jayega!)*

- **Complexity**:
  - **Time Complexity**: \(O(N)\) — Maximum 3 passes lagte hain (Find Pivot + Find Swapper + Reverse Suffix).
  - **Space Complexity**: \(O(1)\) — Purely in-place array swaps!

---

## 🎯 Which approach do you want to implement in TypeScript?

1. **Optimal Approach (In-Place 3-Step Pivot Algorithm — O(N) Time, O(1) Space)** *(Recommended)*
2. **Brute Force Approach (Recursive Permutations Generation — O(N! * N))**
