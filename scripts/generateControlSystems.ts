// scripts/generateControlSystems.ts
import * as fs from "fs";
import * as path from "path";

// Hierarchy definition – leaf nodes are lesson directories
const hierarchy = {
  "01_Control_Systems": {
    "01_Introduction_to_Control_Systems": {
      "01_Definition_of_Control_System": {},
      "02_Objectives_of_Control_Systems": {},
      "03_Examples_of_Control_Systems": {},
      "04_Components_of_Control_System": {
        "01_Input": {},
        "02_Output": {},
        "03_Controller": {},
        "04_Plant_or_Process": {},
        "05_Sensor": {},
        "06_Feedback_Element": {}
      },
      "05_Open_Loop_Control_System": {},
      "06_Closed_Loop_Control_System": {},
      "07_Advantages_and_Disadvantages": {},
      "08_Applications": {}
    }
  },
  "02_Mathematical_Modeling_of_Systems": {
    "01_Translational_Mechanical_Systems": {
      "01_Mass": {},
      "02_Spring": {},
      "03_Damper": {}
    },
    "02_Rotational_Mechanical_Systems": {
      "01_Inertia": {},
      "02_Torsional_Spring": {},
      "03_Friction": {}
    },
    "03_Electrical_Systems": {
      "01_RLC_Circuits": {},
      "02_Kirchhoffs_Laws": {},
      "03_Differential_Equations": {}
    },
    "04_Thermal_Systems": {},
    "05_Hydraulic_Systems": {},
    "06_Analogous_Systems": {
      "01_Force_Voltage_Analogy": {},
      "02_Force_Current_Analogy": {}
    },
    "07_Transfer_Function_Derivation": {}
  },
  "03_Transfer_Function_and_Block_Diagrams": {
    "01_Transfer_Function": {},
    "02_Properties_of_Transfer_Function": {},
    "03_Limitations_of_Transfer_Function": {},
    "04_Poles_and_Zeros": {},
    "05_Block_Diagram_Representation": {},
    "06_Block_Diagram_Reduction_Rules": {},
    "07_Signal_Flow_Graph": {},
    "08_Masons_Gain_Formula": {},
    "09_System_Interconnections": {}
  },
  "04_Time_Response_Analysis": {
    "01_Standard_Test_Signals": {
      "01_Unit_Step_Signal": {},
      "02_Unit_Ramp_Signal": {},
      "03_Unit_Impulse_Signal": {},
      "04_Parabolic_Signal": {}
    },
    "02_First_Order_Systems": {
      "01_Time_Constant": {},
      "02_Response_Analysis": {}
    },
    "03_Second_Order_Systems": {
      "01_Damping_Ratio": {},
      "02_Natural_Frequency": {},
      "03_Types_of_Damping": {}
    },
    "04_Time_Domain_Specifications": {
      "01_Rise_Time": {},
      "02_Peak_Time": {},
      "03_Settling_Time": {},
      "04_Maximum_Overshoot": {}
    },
    "05_Steady_State_Error": {
      "01_Position_Error_Constant": {},
      "02_Velocity_Error_Constant": {},
      "03_Acceleration_Error_Constant": {}
    },
    "06_System_Type_Analysis": {}
  },
  "05_Stability_Analysis": {
    "01_Concept_of_Stability": {},
    "02_Types_of_Stability": {
      "01_Absolute_Stability": {},
      "02_Relative_Stability": {},
      "03_Marginal_Stability": {}
    },
    "03_Routh_Hurwitz_Criterion": {},
    "04_Special_Cases_in_Routh_Array": {},
    "05_Root_Location_Analysis": {},
    "06_Hurwitz_Polynomial": {},
    "07_Stability_Conditions": {}
  },
  "06_Root_Locus_Technique": {
    "01_Introduction_to_Root_Locus": {},
    "02_Root_Locus_Rules": {},
    "03_Root_Locus_Properties": {},
    "04_Breakaway_and_Breakin_Points": {},
    "05_Angle_of_Departure_and_Arrival": {},
    "06_Imaginary_Axis_Crossing": {},
    "07_Effect_of_Adding_Poles_and_Zeros": {},
    "08_Design_Using_Root_Locus": {}
  },
  "07_Frequency_Response_Analysis": {
    "01_Frequency_Response_Basics": {},
    "02_Polar_Plot": {},
    "03_Bode_Plot": {
      "01_Magnitude_Plot": {},
      "02_Phase_Plot": {}
    },
    "04_Nyquist_Plot": {},
    "05_Gain_Margin": {},
    "06_Phase_Margin": {},
    "07_Bandwidth": {},
    "08_Resonant_Peak": {},
    "09_Frequency_Domain_Specifications": {}
  },
  "08_Frequency_Domain_Stability": {
    "01_Nyquist_Stability_Criterion": {},
    "02_Relative_Stability": {},
    "03_Nichols_Chart": {},
    "04_M_Circles": {},
    "05_N_Circles": {}
  },
  "09_Controllers_and_Compensators": {
    "01_P_Controller": {},
    "02_PI_Controller": {},
    "03_PD_Controller": {},
    "04_PID_Controller": {},
    "05_Controller_Tuning": {},
    "06_Lead_Compensation": {},
    "07_Lag_Compensation": {},
    "08_Lead_Lag_Compensation": {},
    "09_Cascade_Compensation": {},
    "10_Practical_Implementation": {}
  },
  "10_State_Space_Analysis": {
    "01_State_Variables": {},
    "02_State_Space_Representation": {},
    "03_State_Equation": {},
    "04_Output_Equation": {},
    "05_Transfer_Function_to_State_Model": {},
    "06_State_Transition_Matrix": {},
    "07_Eigenvalues_and_Eigenvectors": {},
    "08_Controllability": {},
    "09_Observability": {},
    "10_Diagonalization": {}
  },
  "11_Digital_Control_Systems": {
    "01_Introduction_to_Digital_Control": {},
    "02_Sampling_Process": {},
    "03_Sample_and_Hold_Circuit": {},
    "04_Z_Transform": {},
    "05_Inverse_Z_Transform": {},
    "06_Pulse_Transfer_Function": {},
    "07_Stability_in_Z_Domain": {},
    "08_Jury_Stability_Criterion": {},
    "09_Digital_Controllers": {},
    "10_Discrete_State_Space_Models": {}
  },
  "12_Nonlinear_Control_Systems": {
    "01_Introduction_to_Nonlinearity": {},
    "02_Types_of_Nonlinearities": {
      "01_Saturation": {},
      "02_Dead_Zone": {},
      "03_Hysteresis": {},
      "04_Backlash": {}
    },
    "03_Phase_Plane_Analysis": {},
    "04_Describing_Function_Method": {},
    "05_Lyapunov_Stability": {},
    "06_Limit_Cycles": {}
  },
  "13_Modern_Control_Theory": {
    "01_Optimal_Control": {},
    "02_Adaptive_Control": {},
    "03_Robust_Control": {},
    "04_Model_Predictive_Control": {},
    "05_Intelligent_Control": {
      "01_Fuzzy_Logic_Control": {},
      "02_Neural_Network_Control": {},
      "03_AI_Based_Control": {}
    },
    "06_Multivariable_Control_Systems": {}
  },
  "14_Sensors_and_Actuators": {
    "01_Sensors": {
      "01_Temperature_Sensors": {},
      "02_Pressure_Sensors": {},
      "03_Position_Sensors": {},
      "04_Speed_Sensors": {}
    },
    "02_Actuators": {
      "01_DC_Motors": {},
      "02_Servo_Motors": {},
      "03_Stepper_Motors": {},
      "04_Hydraulic_Actuators": {}
    },
    "03_Signal_Conditioning": {}
  },
  "15_Control_System_Design": {
    "01_Design_Specifications": {},
    "02_Time_Domain_Design": {},
    "03_Frequency_Domain_Design": {},
    "04_State_Feedback_Design": {},
    "05_Pole_Placement": {},
    "06_Observer_Design": {},
    "07_Practical_Design_Constraints": {}
  },
  "16_Industrial_Applications": {
    "01_Speed_Control_Systems": {},
    "02_Temperature_Control_Systems": {},
    "03_Robotics_Control": {},
    "04_Aerospace_Control_Systems": {},
    "05_Power_System_Control": {},
    "06_Process_Control": {},
    "07_Automotive_Control_Systems": {},
    "08_Servo_Mechanisms": {}
  },
  "17_Advanced_Control_Topics": {
    "01_Fractional_Order_Control": {},
    "02_Networked_Control_Systems": {},
    "03_Embedded_Control_Systems": {},
    "04_Real_Time_Control": {},
    "05_Cyber_Physical_Systems": {},
    "06_Autonomous_Systems": {},
    "07_IoT_Based_Control_Systems": {}
  },
  "18_Laboratory_and_Simulations": {
    "01_MATLAB_for_Control_Systems": {},
    "02_Simulink_Modeling": {},
    "03_PID_Tuning_Simulations": {},
    "04_Root_Locus_Simulations": {},
    "05_Bode_Plot_Simulations": {},
    "06_State_Space_Simulations": {},
    "07_Hardware_Interfacing": {},
    "08_Mini_Projects": {}
  }
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
      createLessonFile(targetPath, key);
    } else {
      walk(children, targetPath);
    }
  }
}

const baseDir = path.resolve(process.cwd(), "content", "control-systems");
walk(hierarchy, baseDir);
console.log("Control Systems content scaffold generated.");
