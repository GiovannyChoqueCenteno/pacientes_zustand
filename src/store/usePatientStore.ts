import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { DraftPatient, Patient } from "../types";

type PatientStore = {
  patients: Patient[];
  selectedPatient?: Patient;
  addPatient: (data: DraftPatient) => void;
  deletePatient: (id: Patient["id"]) => void;
  selectPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
};

const createPatient = (patient: DraftPatient): Patient => {
  return {
    ...patient,
    id: uuidv4(),
  };
};

export const usePatientStore = create<PatientStore>()(
  devtools(
    persist(
      (set) => ({
        selectedPatient: undefined,
        patients: [],
        addPatient: (data) => {
          set((state) => ({
            patients: [...state.patients, createPatient(data)],
          }));
        },
        deletePatient: (id) => {
          set((state) => ({
            patients: state.patients.filter((patient) => patient.id !== id),
          }));
        },
        selectPatient: (patient) => {
          set(() => ({
            selectedPatient: patient,
          }));
        },
        updatePatient: (patient) => {
          set((state) => ({
            patients: state.patients.map((patientorg) =>
              patientorg.id === patient.id ? patient : patientorg
            ),
            selectedPatient: undefined,
          }));
        },
      }),
      {
        name: "patient-storage",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
