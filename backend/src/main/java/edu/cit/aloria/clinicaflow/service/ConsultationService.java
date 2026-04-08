package edu.cit.aloria.clinicaflow.service;

import edu.cit.aloria.clinicaflow.entity.ConsultationEntity;
import edu.cit.aloria.clinicaflow.repository.ConsultationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ConsultationService {

    @Autowired
    private ConsultationRepository consultationRepository;

    public ConsultationEntity saveConsultation(ConsultationEntity consultation) {
        consultation.setCreatedAt(java.time.LocalDateTime.now());
        if (consultation.getConsultationDate() == null) {
            consultation.setConsultationDate(LocalDate.now());
        }
        return consultationRepository.save(consultation);
    }

    public List<ConsultationEntity> getAllConsultations() {
        return consultationRepository.findAll();
    }

    public Optional<ConsultationEntity> getConsultationById(int id) {
        return consultationRepository.findById(id);
    }

    public List<ConsultationEntity> getConsultationsByDate(LocalDate date) {
        return consultationRepository.findByConsultationDate(date);
    }

    public List<ConsultationEntity> getConsultationsByDoctor(String doctorName) {
        return consultationRepository.findByDoctorName(doctorName);
    }

    public long getTodayCount() {
        return consultationRepository.countByConsultationDate(LocalDate.now());
    }

        public ConsultationEntity updateConsultation(int id, ConsultationEntity consultationDetails) {
            ConsultationEntity consultation = consultationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Consultation not found with id: " + id));
            
            consultation.setPatientName(consultationDetails.getPatientName());
            consultation.setAge(consultationDetails.getAge());
            consultation.setGender(consultationDetails.getGender());
            consultation.setDoctorName(consultationDetails.getDoctorName());
            consultation.setConsultationDate(consultationDetails.getConsultationDate());
            consultation.setSymptoms(consultationDetails.getSymptoms());
            consultation.setDiagnosis(consultationDetails.getDiagnosis());
            consultation.setPrescription(consultationDetails.getPrescription());
            consultation.setRemarks(consultationDetails.getRemarks());
            
            return consultationRepository.save(consultation);
        }

        public void deleteConsultation(int id) {
            ConsultationEntity consultation = consultationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Consultation not found with id: " + id));
            consultationRepository.delete(consultation);
        }

        public ConsultationEntity updateConsultation(int id, ConsultationEntity consultationDetails) {
        ConsultationEntity consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found with id: " + id));
        
        consultation.setPatientName(consultationDetails.getPatientName());
        consultation.setAge(consultationDetails.getAge());
        consultation.setGender(consultationDetails.getGender());
        consultation.setDoctorName(consultationDetails.getDoctorName());
        consultation.setConsultationDate(consultationDetails.getConsultationDate());
        consultation.setSymptoms(consultationDetails.getSymptoms());
        consultation.setDiagnosis(consultationDetails.getDiagnosis());
        consultation.setPrescription(consultationDetails.getPrescription());
        consultation.setRemarks(consultationDetails.getRemarks());
        
        return consultationRepository.save(consultation);
    }

    public void deleteConsultation(int id) {
        ConsultationEntity consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found with id: " + id));
        consultationRepository.delete(consultation);
    }
}