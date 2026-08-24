# 🌳 Binary Tree Postorder Traversal — Phase-Based Marker Iterative Algorithm

## 📌 Problem Statement
Given the `root` of a binary tree, return the **postorder traversal** of its nodes' values.
- **Postorder Traversal Order**: `LEFT SUBTREE` $\rightarrow$ `RIGHT SUBTREE` $\rightarrow$ `ROOT (CURRENT)`

```
        1
       / \
      2   3
     / \
    4   5

Postorder Output: [4, 5, 2, 3, 1]
```

---

## 🧠 Approaches Overview

### 1. Approach 1: Classic Recursive Traversal (Brute/Direct)
- **Time Complexity:** $O(N)$
- **Space Complexity:** $O(H)$ (Call stack, where $H$ is tree height)
- **Concept:** Function calls `postorder(node.left)`, then `postorder(node.right)`, then pushes `node.val`.

### 2. Approach 2: Two-Stack Iterative Simulation
- **Time Complexity:** $O(N)$
- **Space Complexity:** $O(N)$
- **Concept:** Preorder (`Root -> Right -> Left`) run karke results ko doosre stack mein reverse store karte hain.

### 3. Approach 3: Universal Frame-Based State Machine Stack (The Target Algorithm) ⭐⭐⭐⭐⭐
- **Time Complexity:** $O(N)$
- **Space Complexity:** $O(H)$ (Single explicit stack)
- **Key Idea:** Har stack element ek `TraversalFrame` hota hai:
  - `phase: 'expand'`: Node ke children ko schedule karo.
  - `phase: 'visit'`: Children process ho chuke hain, ab is node ki value `result` mein dalo.

---

## 🔄 The "WHY" Behind the LIFO Scheduling Order

Hamari desired execution order hai:
$$\text{LEFT} \longrightarrow \text{RIGHT} \longrightarrow \text{ROOT}$$

Lekin **Stack LIFO (Last-In, First-Out)** data structure hai — jo cheez **last push** hogi, woh **pehle pop/execute** hogi.

Isliye stack mein push ka order **theek ulta (reverse)** hota hai:

| Order of Push into Stack | Frame Pushed | Why? |
| :---: | :---: | :--- |
| **1st (Bottom-most)** | `{ node: current, phase: 'visit' }` | Root ko sabse **LAST** mein visit karna hai, isliye iska marker sabse pehle push karke bottom mein daal diya. |
| **2nd (Middle)** | `{ node: current.right, phase: 'expand' }` | Right subtree ko Left ke **BAAD** process karna hai, isliye isse Left se pehle push kiya. |
| **3rd (Top-most)** | `{ node: current.left, phase: 'expand' }` | Left subtree ko sabse **PEHLE** execute karna hai, isliye isse last push kiya taaki yeh stack ke top par rahe! |

---

## 🎯 Step-by-Step Dry Run Example

Tree:
```
    1
   / \
  2   3
```

1. **Initial Stack**: `[{ node: 1, phase: 'expand' }]`
2. **Pop 1 (expand)**:
   - Push `{ node: 1, phase: 'visit' }`
   - Push `{ node: 3, phase: 'expand' }`
   - Push `{ node: 2, phase: 'expand' }`
   - *Stack (Top to Bottom)*: `[ 2(expand), 3(expand), 1(visit) ]`
3. **Pop 2 (expand)**:
   - No children for 2
   - Push `{ node: 2, phase: 'visit' }`
   - *Stack*: `[ 2(visit), 3(expand), 1(visit) ]`
4. **Pop 2 (visit)**:
   - `result.push(2)` $\rightarrow$ `result = [2]`
   - *Stack*: `[ 3(expand), 1(visit) ]`
5. **Pop 3 (expand)**:
   - Push `{ node: 3, phase: 'visit' }`
   - *Stack*: `[ 3(visit), 1(visit) ]`
6. **Pop 3 (visit)**:
   - `result.push(3)` $\rightarrow$ `result = [2, 3]`
   - *Stack*: `[ 1(visit) ]`
7. **Pop 1 (visit)**:
   - `result.push(1)` $\rightarrow$ `result = [2, 3, 1]`
   - *Stack*: `[]` (Empty)
8. **Final Result**: `[2, 3, 1]` ✅
