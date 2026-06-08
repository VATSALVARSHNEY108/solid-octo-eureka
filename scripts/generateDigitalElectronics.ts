// scripts/generateDigitalElectronics.ts
import * as fs from "fs";
import * as path from "path";

// Define the hierarchy as nested objects. Leaf nodes are lesson names.
const hierarchy = {
  "01_Introduction_to_Digital_Electronics": {
    "01_Analog_vs_Digital_Systems": {},
    "02_Advantages_of_Digital_Systems": {},
    "03_Applications_of_Digital_Electronics": {},
    "04_Digital_Signal_Basics": {},
    "05_Number_Systems_Overview": {},
    "06_Logic_Levels_and_Voltage": {}
  },
  "02_Number_Systems_and_Codes": {
    "01_Decimal_Number_System": {},
    "02_Binary_Number_System": {},
    "03_Octal_Number_System": {},
    "04_Hexadecimal_Number_System": {},
    "05_Number_System_Conversions": {},
    "06_Binary_Arithmetic": {
      "01_Binary_Addition": {},
      "02_Binary_Subtraction": {},
      "03_Binary_Multiplication": {},
      "04_Binary_Division": {}
    },
    "07_Complements": {
      "01_1s_Complement": {},
      "02_2s_Complement": {}
    },
    "08_Signed_and_Unsigned_Numbers": {},
    "09_BCD_Code": {},
    "10_Gray_Code": {},
    "11_ASCII_and_Unicode": {},
    "12_Excess_3_Code": {},
    "13_Error_Detection_Codes": {}
  },
  "03_Boolean_Algebra_and_Logic_Gates": {
    "01_Boolean_Algebra_Basics": {},
    "02_Boolean_Laws_and_Theorems": {},
    "03_DeMorgans_Theorem": {},
    "04_Boolean_Expression_Simplification": {},
    "05_Logic_Gates_Introduction": {},
    "06_AND_Gate": {},
    "07_OR_Gate": {},
    "08_NOT_Gate": {},
    "09_NAND_Gate": {},
    "10_NOR_Gate": {},
    "11_XOR_Gate": {},
    "12_XNOR_Gate": {},
    "13_Universal_Gates": {},
    "14_Logic_Gate_Implementations": {},
    "15_Truth_Tables": {}
  },
  "04_Logic_Families_and_ICs": {
    "01_Introduction_to_Logic_Families": {},
    "02_TTL_Logic": {},
    "03_CMOS_Logic": {},
    "04_ECL_Logic": {},
    "05_Logic_Family_Comparison": {},
    "06_Fan_In_and_Fan_Out": {},
    "07_Noise_Margin": {},
    "08_Propagation_Delay": {},
    "09_Power_Dissipation": {},
    "10_IC_Numbering_and_Packages": {}
  },
  "05_Boolean_Function_Minimization": {
    "01_Canonical_Forms": {
      "01_SOP_Form": {},
      "02_POS_Form": {}
    },
    "02_Minterms_and_Maxterms": {},
    "03_Karnaugh_Map_Basics": {},
    "04_2_Variable_KMap": {},
    "05_3_Variable_KMap": {},
    "06_4_Variable_KMap": {},
    "07_5_Variable_KMap": {},
    "08_Dont_Care_Conditions": {},
    "09_Quine_McCluskey_Method": {},
    "10_Logic_Circuit_Optimization": {}
  },
  "06_Combinational_Circuits": {
    "01_Introduction_to_Combinational_Circuits": {},
    "02_Half_Adder": {},
    "03_Full_Adder": {},
    "04_Half_Subtractor": {},
    "05_Full_Subtractor": {},
    "06_Parallel_Adder": {},
    "07_Serial_Adder": {},
    "08_Binary_Comparator": {},
    "09_Encoder": {},
    "10_Decoder": {},
    "11_Multiplexer": {},
    "12_Demultiplexer": {},
    "13_Priority_Encoder": {},
    "14_ALU_Basics": {},
    "15_Code_Converters": {}
  },
  // Additional top‑level topics can be added here following the same pattern.
};

function createLessonFile(dir: string, lessonName: string) {
  const componentName = lessonName.replace(/[^a-zA-Z0-9]/g, "");
  const content = `import React from "react";

export default function ${componentName}() {
  return (
    <div className="px-12 py-24">
      <h1 className="text-2xl font-bold">${lessonName.replace(/_/g, " ")}</h1>
      <p className="mt-4">Content coming soon.</p>
    </div>
  );
}`;
  fs.writeFileSync(path.join(dir, "index.tsx"), content, "utf8");
}

function walk(node: any, currentPath: string) {
  for (const key of Object.keys(node)) {
    const targetPath = path.join(currentPath, key);
    fs.mkdirSync(targetPath, { recursive: true });
    const children = node[key];
    if (Object.keys(children).length === 0) {
      // leaf lesson
      createLessonFile(targetPath, key);
    } else {
      // intermediate folder (topic)
      walk(children, targetPath);
    }
  }
}

const baseDir = path.resolve(process.cwd(), "content", "digital-electronics");
walk(hierarchy, baseDir);
console.log("Digital Electronics content scaffold generated.");
