# Problem Explanation: Trapping Rain Water — LeetCode 42 🌧️🌊

Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.

---

## 📌 Problem Example
```
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6

Visual Elevation Map:
3 |                   [█]
2 |          [█] . . .[█][█] .[█]
1 |    [█] . [█][█] . [█][█][█][█][█]
0 | [ ][█][ ][█][█][ ][█][█][█][█][█][█]
   -----------------------------------
idx: 0  1  2  3  4  5  6  7  8  9 10 11
Water trapped at index 2 (1 unit), index 4 (1 unit), index 5 (2 units), index 6 (1 unit), index 9 (1 unit) = Total 6 units!
```

---

## 🎯 Core Mathematical Intuition (Water Level Formula)
Kisi bhi bar `i` ke upar kitna paani rukega (trap hoga)?
> **Formula**: `Water[i] = min(maxLeftHeight, maxRightHeight) - height[i]` (if > 0)
- Paani ko rokne ke liye left side aur right side dono taraf boundary (walls) chahiye.
- Jo side chhoti (shorter wall) hogi, paani ka level wahi limit karegi (`min(leftMax, rightMax)`).
- Agar us point ki ground height `height[i]` hai, toh upar bacha hua gap `min(leftMax, rightMax) - height[i]` trap ho jayega!

---

## 🧠 Approach 1: Brute Force (Calculate LeftMax & RightMax for Every Index)

### 💡 Intuition & Logic (Why & How)
Har index `i` ke liye:
1. Left side traverse karke sabse unchi wall find karo: `leftMax = max(height[0...i])`.
2. Right side traverse karke sabse unchi wall find karo: `rightMax = max(height[i...n-1])`.
3. Paani calculate karo: `water += min(leftMax, rightMax) - height[i]`.

### ⏱️ Complexity Analysis
- **Time Complexity**: `O(N^2)` — Har element ke liye left aur right scan karna padta hai.
- **Space Complexity**: `O(1)` — Extra memory nahi lagti.

---

## 🧠 Approach 2: Better Approach (Precomputed Prefix Max & Suffix Max Arrays)

### 💡 Intuition & Logic (Why & How)
Brute force mein baar-baar left aur right max dhoondhne ki bajaye, hum 2 auxiliary arrays precompute kar lete hain:
1. `prefixMax[i]`: Index `0` se `i` tak ka maximum height.
2. `suffixMax[i]`: Index `i` se `n-1` tak ka maximum height.
3. Ek single pass mein `water += min(prefixMax[i], suffixMax[i]) - height[i]` calculate kar lo.

### ⏱️ Complexity Analysis
- **Time Complexity**: `O(N)` — 3 linear passes (`prefix`, `suffix`, calculate).
- **Space Complexity**: `O(N)` — Do extra arrays (`prefixMax` aur `suffixMax`) chahiye.

---

## 🧠 Approach 3: Optimal Approach (Two Pointers — Single Pass O(N) Time, O(1) Space) 🌟

### 💡 Intuition & Logic (Why & How)
Kyunki paani ka level hamesha **shorter wall** se decide hota hai, hum 2 pointers (`left = 0` aur `right = n - 1`) aur do variables `leftMax = 0`, `rightMax = 0` use kar sakte hain!

### 🔄 Algorithm Steps:
1. `left = 0`, `right = n - 1`, `leftMax = 0`, `rightMax = 0`, `totalWater = 0`
2. Jab tak `left <= right`:
   - Agar `height[left] <= height[right]`:
     - Yani right side mein already ek aisi wall hai jo `height[left]` se badi ya barabar hai! Toh bottle-neck **left side** hi hai!
     - Agar `height[left] >= leftMax`: update karo `leftMax = height[left]`.
     - Warna: `totalWater += leftMax - height[left]`.
     - `left++`
   - Warna (`height[left] > height[right]`):
     - Yani bottle-neck **right side** hai!
     - Agar `height[right] >= rightMax`: update karo `rightMax = height[right]`.
     - Warna: `totalWater += rightMax - height[right]`.
     - `right--`

### ⏱️ Complexity Analysis
- **Time Complexity**: `O(N)` — Single pass traversal!
- **Space Complexity**: `O(1)` — In-place without any extra arrays!

---

## 🎯 Which approach would you like to implement & visualize?

Please choose one of the options below:
- **Option A (Optimal)**: Two Pointers (`O(N)` Time, `O(1)` Space — LeftMax & RightMax Dynamic Invariant).
- **Option B (Better)**: Prefix Max & Suffix Max Arrays (`O(N)` Time, `O(N)` Space).
- **Option C (Brute Force)**: Nested Scans (`O(N^2)` Time, `O(1)` Space).
