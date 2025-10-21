
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import StepIndicator from "@/components/reservations/StepIndicator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Reservation } from "@/api/entities";
import { SendEmail } from "@/api/integrations";

export default function RegularModify() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedReservationNumber, setSubmittedReservationNumber] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  // Removed timePickerOpen
  const [reservationOpenDatePickerOpen, setReservationOpenDatePickerOpen] = useState(false);
  
  const [showSecondChoice, setShowSecondChoice] = useState(false);
  const [date2PickerOpen, setDate2PickerOpen] = useState(false);
  // Removed time2PickerOpen
  const [reservationOpenDate2PickerOpen, setReservationOpenDate2PickerOpen] = useState(false);

  const [formData, setFormData] = useState({
    reservationNumber: "",
    applicantName: "",
    applicantResidentNumber: "",
    applicantTelecom: "",
    applicantPhoneNumber: "",
    districtType: "",
    region: "",
    crematorium: "",
    desiredDate: format(new Date(), "yyyy-MM-dd"),
    desiredSession: "",
    reservationOpenDate: format(new Date(), "yyyy-MM-dd"),
    reservationTime: "",
    districtType2: "",
    region2: "",
    crematorium2: "",
    desiredDate2: format(new Date(), "yyyy-MM-dd"),
    desiredSession2: "",
    reservationOpenDate2: format(new Date(), "yyyy-MM-dd"),
    reservationTime2: "",
    howDidYouKnow: "",
    additionalRequest: ""
  });
  const lastValidReservationNumber = useRef("");

  const steps = [
    { number: 1, label: "기존 예약 정보" },
    { number: 2, label: "희망 화장 정보" },
    { number: 3, label: "추가 정보" }
  ];

  const crematoriumsByRegion = {
    gangwon: [
      { value: "donghae-samcheok", label: "동해삼척 공동화장장(승화원)" },
      { value: "sokcho", label: "속초시승화원" },
      { value: "solhyang", label: "솔향하늘길" },
      { value: "wonju", label: "원주추모공원 화장장" },
      { value: "inje", label: "인제 하늘내린도리안" },
      { value: "jeongseon", label: "정선하늘터" },
      { value: "chuncheon", label: "춘천안식원" },
      { value: "taebaek", label: "태백시화장장" }
    ],
    gyeonggi: [
      { value: "seongnam", label: "성남시장례문화사업소" },
      { value: "suwon", label: "수원시연화장" },
      { value: "yongin", label: "용인 평온의 숲" },
      { value: "hwaseong", label: "화성 함백산추모공원" }
    ],
    gyeongnam: [
      { value: "goseong", label: "고성군공설화장장" },
      { value: "gimhae", label: "김해추모의공원" },
      { value: "namhae", label: "남해추모누리영화원" },
      { value: "miryang", label: "밀양시공설화장시설" },
      { value: "sacheon", label: "사천시 누리원(화장시설)" },
      { value: "jinju", label: "진주시안락공원" },
      { value: "changwon-masan", label: "창원시립마산화장장" },
      { value: "changwon-sangbok", label: "창원시립상복공원" },
      { value: "tongyeong", label: "통영시추모공원" },
      { value: "haman", label: "함안하늘공원" }
    ],
    gyeongbuk: [
      { value: "gyeongju", label: "경주하늘마루관리사무소" },
      { value: "gumi", label: "구미시추모공원" },
      { value: "gimcheon", label: "김천시립추모공원" },
      { value: "mungyeong", label: "문경예송원" },
      { value: "sangju", label: "상주시승천원" },
      { value: "andong", label: "안동장사문화공원" },
      { value: "yeongju", label: "영주시화장장" },
      { value: "ulleung", label: "울릉하늘섬공원" },
      { value: "uljin", label: "울진군립추모원" },
      { value: "uiseong", label: "의성군공설화장장" },
      { value: "pohang-guryongpo", label: "포항시립구룡포화장장" },
      { value: "pohang-uhyeon", label: "포항시립우현화장장" }
    ],
    gwangju: [
      { value: "gwangju-yeongnak", label: "광주시영락공원" }
    ],
    daegu: [
      { value: "daegu-myeongbok", label: "대구명복공원" }
    ],
    daejeon: [
      { value: "daejeon-jeongsuwon", label: "대전시정수원" }
    ],
    busan: [
      { value: "busan-yeongnak", label: "부산영락공원" }
    ],
    seoul: [
      { value: "seoul-seunghwawon", label: "서울시립승화원" },
      { value: "seoul-memorial", label: "서울추모공원" }
    ],
    sejong: [
      { value: "sejong-eunhasu", label: "세종시은하수공원" }
    ],
    ulsan: [
      { value: "ulsan-sky", label: "울산하늘공원" }
    ],
    incheon: [
      { value: "incheon-family", label: "인천가족공원" }
    ],
    jeonnam: [
      { value: "gwangyang", label: "광양시화장장" },
      { value: "sorokdo", label: "국립소록도병원화장장" },
      { value: "namdo", label: "남도광역추모공원" },
      { value: "mokpo", label: "목포추모공원" },
      { value: "suncheon", label: "순천시립 추모공원" },
      { value: "yeosu", label: "여수시 영락공원 승화원" },
      { value: "cheonggye", label: "재단법인 청계원" }
    ],
    jeonbuk: [
      { value: "gunsan", label: "군산시승화원" },
      { value: "namwon", label: "남원시승화원" },
      { value: "seonam", label: "서남권추모공원" },
      { value: "iksan", label: "익산하늘공원정수원" },
      { value: "jeonju", label: "전주시승화원" }
    ],
    jeju: [
      { value: "jeju-yangji", label: "제주특별자치도 양지공원" }
    ],
    chungnam: [
      { value: "gongju", label: "공주나래원" },
      { value: "cheonan", label: "천안도시공사 천안추모공원" },
      { value: "hongseong", label: "홍성군공공시설관리사업소" }
    ],
    chungbuk: [
      { value: "jecheon", label: "제천시영원한쉼터" },
      { value: "cheongju", label: "청주시목련공원" },
      { value: "chungju", label: "충주시공설화장장 하늘나라" }
    ]
  };

  const formatDateWithDay = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return format(date, "yyyy-MM-dd (EEE)", { locale: ko });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  const formatReservationNumber = (value) => {
    const alphanumeric = value.replace(/[^a-zA-Z0-9]/g, '');
    const parts = [];
    
    if (alphanumeric.length > 0) {
      parts.push(alphanumeric.slice(0, 8));
    }
    if (alphanumeric.length > 8) {
      parts.push(alphanumeric.slice(8, 12));
    }
    if (alphanumeric.length > 12) {
      parts.push(alphanumeric.slice(12, 16));
    }
    
    return parts.join('-');
  };

  const formatResidentNumber = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    
    if (numbers.length <= 6) {
      return numbers;
    }
    
    return `${numbers.slice(0, 6)}-${numbers.slice(6, 7)}`;
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    const parts = [];
    
    if (numbers.length > 0) {
      parts.push(numbers.slice(0, 3));
    }
    if (numbers.length > 3) {
      parts.push(numbers.slice(3, 7));
    }
    if (numbers.length > 7) {
      parts.push(numbers.slice(7, 11));
    }
    
    return parts.join('-');
  };

  const formatTime = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    const parts = [];
    
    if (numbers.length > 0) {
      parts.push(numbers.slice(0, 2));
    }
    if (numbers.length > 2) {
      parts.push(numbers.slice(2, 4));
    }
    if (numbers.length > 4) {
      parts.push(numbers.slice(4, 6));
    }
    
    return parts.join(':');
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;

    if (field === 'reservationNumber') {
      const cleanValue = value.replace(/-/g, '');
      const hasInvalidChars = /[^a-zA-Z0-9]/g.test(cleanValue);
      
      if (hasInvalidChars) {
        toast({
          title: "입력 오류",
          description: "예약번호는 영문 알파벳과 숫자만 입력 가능합니다.",
          variant: "destructive",
        });
        formattedValue = lastValidReservationNumber.current;
      } else {
        formattedValue = formatReservationNumber(value);
        lastValidReservationNumber.current = formattedValue;
      }
    } else if (field === 'applicantResidentNumber') {
      formattedValue = formatResidentNumber(value);
    } else if (field === 'applicantPhoneNumber') {
      formattedValue = formatPhoneNumber(value);
    } else if (field === 'reservationTime' || field === 'reservationTime2') {
      formattedValue = formatTime(value);
    } else if (field === 'region') {
      setFormData(prev => ({ ...prev, [field]: value, crematorium: "" }));
      return;
    } else if (field === 'region2') {
      setFormData(prev => ({ ...prev, [field]: value, crematorium2: "" }));
      return;
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  // Removed handleTimeChange

  const handleDateSelect = (fieldName, date) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      setFormData(prev => ({ ...prev, [fieldName]: formattedDate }));
      if (fieldName === 'desiredDate') setDatePickerOpen(false);
      else if (fieldName === 'reservationOpenDate') setReservationOpenDatePickerOpen(false);
      else if (fieldName === 'desiredDate2') setDate2PickerOpen(false);
      else if (fieldName === 'reservationOpenDate2') setReservationOpenDate2PickerOpen(false);
    } else {
      setFormData(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      const missingFields = [];
      
      if (!formData.reservationNumber) missingFields.push("예약번호");
      if (!formData.applicantName) missingFields.push("신청자 이름");
      if (!formData.applicantResidentNumber) missingFields.push("주민번호");
      if (!formData.applicantTelecom) missingFields.push("통신사");
      if (!formData.applicantPhoneNumber) missingFields.push("전화번호");

      if (missingFields.length > 0) {
        toast({
          title: "필수 입력값을 입력해주세요",
          description: `다음 항목을 입력해주세요: ${missingFields.join(", ")}`,
          variant: "destructive",
        });
        return;
      }

      // 예약번호 중복 체크
      try {
        const existingReservations = await Reservation.filter({ 
          reservationNumber: formData.reservationNumber 
        });
        
        if (existingReservations && existingReservations.length > 0) {
          toast({
            title: "예약번호 중복",
            description: "이미 사용 중인 예약번호입니다. 다른 예약번호를 입력해주세요.",
            variant: "destructive",
          });
          return;
        }
      } catch (error) {
        console.error("예약번호 중복 체크 실패:", error);
        toast({
          title: "오류 발생",
          description: "예약번호 확인 중 오류가 발생했습니다. 다시 시도해주세요.",
          variant: "destructive",
        });
        return;
      }

      setCurrentStep(2);
    } else if (currentStep === 2) {
      const missingFields = [];
      
      if (!formData.region) missingFields.push("1순위 지역 선택");
      if (!formData.crematorium) missingFields.push("1순위 화장장 이름");
      
      if (!formData.desiredDate) {
        missingFields.push("1순위 희망 화장 일정");
      }

      if (!formData.desiredSession) missingFields.push("1순위 희망 화장 회차");

      if (showSecondChoice && formData.region2) {
        if (!formData.crematorium2) missingFields.push("2순위 화장장 이름");
        if (!formData.desiredDate2) missingFields.push("2순위 희망 화장 일정");
        if (!formData.desiredSession2) missingFields.push("2순위 희망 화장 회차");
      }

      if (missingFields.length > 0) {
        toast({
          title: "필수 입력값을 입력해주세요",
          description: `다음 항목을 입력해주세요: ${missingFields.join(", ")}`,
          variant: "destructive",
        });
        return;
      }

      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!formData.howDidYouKnow) {
        toast({
          title: "필수 입력값을 입력해주세요",
          description: "패스트캐치를 알게 된 경로를 선택해주세요",
          variant: "destructive",
        });
        return;
      }
      
      try {
        await Reservation.create({
          reservationNumber: formData.reservationNumber,
          applicantName: formData.applicantName,
          applicantResidentNumber: formData.applicantResidentNumber,
          applicantTelecom: formData.applicantTelecom,
          applicantPhoneNumber: formData.applicantPhoneNumber,
          districtType: formData.districtType,
          region: formData.region,
          crematorium: formData.crematorium,
          desiredDate: formData.desiredDate,
          desiredSession: formData.desiredSession,
          reservationOpenDate: formData.reservationOpenDate || null,
          reservationTime: formData.reservationTime || null,
          districtType2: showSecondChoice ? (formData.districtType2 || null) : null,
          region2: showSecondChoice ? (formData.region2 || null) : null,
          crematorium2: showSecondChoice ? (formData.crematorium2 || null) : null,
          desiredDate2: showSecondChoice ? (formData.desiredDate2 || null) : null,
          desiredSession2: showSecondChoice ? (formData.desiredSession2 || null) : null,
          reservationOpenDate2: showSecondChoice ? (formData.reservationOpenDate2 || null) : null,
          reservationTime2: showSecondChoice ? (formData.reservationTime2 || null) : null,
          howDidYouKnow: formData.howDidYouKnow,
          additionalRequest: formData.additionalRequest,
          serviceType: "일반시신 예약변경",
          processingStatus: "접수완료",
          successStatus: "대기중"
        });

        const emailRecipients = ["hsi8925@gmail.com", "estta39@gmail.com"];
        
        const telecomLabels = {
          "skt": "SKT",
          "kt": "KT",
          "lgu": "LG U+",
          "skt-mvno": "SKT 알뜰폰",
          "kt-mvno": "KT 알뜰폰",
          "lgu-mvno": "LG U+ 알뜰폰"
        };
        
        const howDidYouKnowLabels = {
          "recommendation": "지인 추천",
          "funeral-community": "장례업계 커뮤니티",
          "promotion-sms": "홍보문자",
          "blog": "블로그",
          "search": "인터넷 검색",
          "sns": "SNS (페이스북, 인스타그램 등)",
          "youtube": "유튜브",
          "advertisement": "광고",
          "other": "기타"
        };
        
        const emailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">
              예약 변경이 접수되었습니다
            </h2>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">📋 서비스 정보</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>서비스 유형:</strong> 일반시신 예약변경</li>
                <li><strong>예약번호:</strong> ${formData.reservationNumber}</li>
                <li><strong>접수 시각:</strong> ${new Date().toLocaleString('ko-KR')}</li>
              </ul>
            </div>

            <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">👤 신청자 정보</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>성명:</strong> ${formData.applicantName}</li>
                <li><strong>전화번호:</strong> ${formData.applicantPhoneNumber}</li>
                <li><strong>통신사:</strong> ${telecomLabels[formData.applicantTelecom] || formData.applicantTelecom}</li>
              </ul>
            </div>

            <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">🏛️ 1순위 희망 화장 정보</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>관내/관외:</strong> ${formData.districtType || '-'}</li>
                <li><strong>화장장:</strong> ${formData.crematorium}</li>
                <li><strong>희망 화장 일정:</strong> ${formData.desiredDate} ${formData.desiredSession}회차</li>
                <li><strong>예약 오픈 일자:</strong> ${formData.reservationOpenDate || '-'}</li>
                <li><strong>예약 오픈 시간:</strong> ${formData.reservationTime || '-'}</li>
              </ul>
            </div>

            ${showSecondChoice ? `
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">🏛️ 2순위 희망 화장 정보</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>관내/관외:</strong> ${formData.districtType2 || '-'}</li>
                <li><strong>화장장:</strong> ${formData.crematorium2 || '-'}</li>
                <li><strong>희망 화장 일정:</strong> ${formData.desiredDate2 || '-'} ${formData.desiredSession2 || '-'}회차</li>
                <li><strong>예약 오픈 일자:</strong> ${formData.reservationOpenDate2 || '-'}</li>
                <li><strong>예약 오픈 시간:</strong> ${formData.reservationTime2 || '-'}</li>
              </ul>
            </div>
            ` : ''}

            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">📝 추가 정보</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>알게 된 경로:</strong> ${howDidYouKnowLabels[formData.howDidYouKnow] || formData.howDidYouKnow}</li>
                <li><strong>추가 요청사항:</strong> ${formData.additionalRequest || '-'}</li>
              </ul>
            </div>

            <div style="border-top: 2px solid #e5e7eb; margin-top: 30px; padding-top: 15px; text-align: center; color: #6b7280; font-size: 12px;">
              <p>패스트캐치 예약 시스템 자동 발송 메일입니다.</p>
            </div>
          </div>
        `;

        for (const recipient of emailRecipients) {
          try {
            await SendEmail({
              from_name: "패스트캐치",
              to: recipient,
              subject: `[패스트캐치] 예약 변경 접수 - ${formData.reservationNumber}`,
              body: emailBody
            });
          } catch (emailError) {
            console.error(`Failed to send email to ${recipient}:`, emailError);
          }
        }
        
        setSubmittedReservationNumber(formData.reservationNumber);
        setIsSubmitted(true);
      } catch (error) {
        toast({
          title: "저장 실패",
          description: "예약 정보 저장 중 오류가 발생했습니다.",
          variant: "destructive",
        });
        console.error("Failed to create reservation:", error);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNewApplication = () => {
    navigate(createPageUrl("MyReservations") + `?reservationNumber=${submittedReservationNumber}`);
  };

  const availableCrematoriums = formData.region ? (crematoriumsByRegion[formData.region] || []) : [];

  if (isSubmitted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] py-8 px-6 sm:px-6 lg:px-8 bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-blue-500" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              신청이 완료되었습니다
            </h2>
            
            <p className="text-sm text-gray-600 mb-2 leading-relaxed">
              예약 대행 신청이 성공적으로 접수되었습니다.
            </p>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              추가 안내사항은 별도 연락 드리겠습니다.
            </p>
            
            <Button
              onClick={handleNewApplication}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-base font-medium"
            >
              나의 예약 정보 확인
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-6 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <style>{`
            @media (max-width: 640px) {
              input::placeholder, select::placeholder {
                font-size: 0.86rem;
              }
              .placeholder-small::placeholder {
                font-size: 0.86rem;
              }
            }
            input, select, [role="combobox"] {
              font-size: 0.92rem;
            }
          `}</style>

          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">
            예약 변경 신청
          </h1>

          <StepIndicator currentStep={currentStep} steps={steps} />

          {currentStep === 1 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                기존 예약 정보
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                * 표시된 항목은 필수 입력 사항입니다
              </p>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reservationNumber" className="text-gray-700 font-medium mb-2 block">
                      예약번호 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="reservationNumber"
                      placeholder="OOOOOOOO-OOOO-OOOO"
                      value={formData.reservationNumber}
                      onChange={(e) => handleInputChange("reservationNumber", e.target.value)}
                      className="h-12 text-base"
                      maxLength={18}
                    />
                  </div>

                  <div>
                    <Label htmlFor="applicantName" className="text-gray-700 font-medium mb-2 block">
                      신청자 이름 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="applicantName"
                      placeholder="신청자 성명을 입력하세요"
                      value={formData.applicantName}
                      onChange={(e) => handleInputChange("applicantName", e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="applicantResidentNumber" className="text-gray-700 font-medium mb-2 block">
                    주민번호 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="applicantResidentNumber"
                    placeholder="주민번호 7자리를 입력하세요. (예: 820317-1)"
                    value={formData.applicantResidentNumber}
                    onChange={(e) => handleInputChange("applicantResidentNumber", e.target.value)}
                    className="h-12 text-base"
                    maxLength={8}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    개인정보 보호를 위해 뒷자리는 첫 번째 숫자만 입력하세요 (총 7자리)
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="applicantTelecom" className="text-gray-700 font-medium mb-2 block">
                      통신사 <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.applicantTelecom} onValueChange={(value) => handleInputChange("applicantTelecom", value)}>
                      <SelectTrigger className="h-12 text-base placeholder-small">
                        <SelectValue placeholder="통신사를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="skt">SKT</SelectItem>
                        <SelectItem value="kt">KT</SelectItem>
                        <SelectItem value="lgu">LG U+</SelectItem>
                        <SelectItem value="skt-mvno">SKT 알뜰폰</SelectItem>
                        <SelectItem value="kt-mvno">KT 알뜰폰</SelectItem>
                        <SelectItem value="lgu-mvno">LG U+ 알뜰폰</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="applicantPhoneNumber" className="text-gray-700 font-medium mb-2 block">
                      전화번호 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="applicantPhoneNumber"
                      placeholder="010-1234-5678"
                      value={formData.applicantPhoneNumber}
                      onChange={(e) => handleInputChange("applicantPhoneNumber", e.target.value)}
                      className="h-12 text-base"
                      maxLength={13}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                희망 화장 정보
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                * 표시된 항목은 필수 입력 사항입니다
              </p>

              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg px-4 py-2 mb-4">
                  <h3 className="text-base font-semibold text-blue-900">1순위 정보</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700 font-medium mb-3 block">
                      관내/관외 구분
                    </Label>
                    <RadioGroup 
                      value={formData.districtType} 
                      onValueChange={(value) => handleInputChange("districtType", value)}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="관내" id="district-in" />
                        <Label htmlFor="district-in" className="font-normal cursor-pointer">관내</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="관외" id="district-out" />
                        <Label htmlFor="district-out" className="font-normal cursor-pointer">관외</Label>
                      </div>
                    </RadioGroup>
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-xs text-gray-700 leading-relaxed">
                        예약하려는 화장장이 위치한 지역에 고인의 주민등록상 주소지가 있는 경우 <strong>관내</strong>. 그 외는 <strong>관외</strong>를 선택해주세요.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="region" className="text-gray-700 font-medium mb-2 block">
                        지역 선택 <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                        <SelectTrigger className="h-12 text-base placeholder-small">
                          <SelectValue placeholder="시, 도를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="seoul">서울특별시</SelectItem>
                          <SelectItem value="busan">부산광역시</SelectItem>
                          <SelectItem value="daegu">대구광역시</SelectItem>
                          <SelectItem value="incheon">인천광역시</SelectItem>
                          <SelectItem value="gwangju">광주광역시</SelectItem>
                          <SelectItem value="daejeon">대전광역시</SelectItem>
                          <SelectItem value="ulsan">울산광역시</SelectItem>
                          <SelectItem value="sejong">세종특별자치시</SelectItem>
                          <SelectItem value="gyeonggi">경기도</SelectItem>
                          <SelectItem value="gangwon">강원특별자치도</SelectItem>
                          <SelectItem value="chungbuk">충청북도</SelectItem>
                          <SelectItem value="chungnam">충청남도</SelectItem>
                          <SelectItem value="jeonbuk">전북특별자치도</SelectItem>
                          <SelectItem value="jeonnam">전라남도</SelectItem>
                          <SelectItem value="gyeongbuk">경상북도</SelectItem>
                          <SelectItem value="gyeongnam">경상남도</SelectItem>
                          <SelectItem value="jeju">제주특별자치도</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="crematorium" className="text-gray-700 font-medium mb-2 block">
                        화장장 이름 <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={formData.crematorium} 
                        onValueChange={(value) => handleInputChange("crematorium", value)}
                        disabled={!formData.region}
                      >
                        <SelectTrigger className="h-12 text-base placeholder-small">
                          <SelectValue placeholder={formData.region ? "화장장을 선택하세요" : "지역을 먼저 선택하세요"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCrematoriums.map((crematorium) => (
                            <SelectItem key={crematorium.value} value={crematorium.label}>
                              {crematorium.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="desiredDate" className="text-gray-700 font-medium mb-2 block">
                        희망 화장 일정 <span className="text-red-500">*</span>
                      </Label>
                      <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-12 justify-between text-left font-normal text-base hover:bg-gray-50 transition-colors"
                          >
                            <span>
                              {formData.desiredDate ? formatDateWithDay(formData.desiredDate) : "년도-월-일"}
                            </span>
                            <CalendarIcon className="h-5 w-5 text-gray-500" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.desiredDate ? new Date(formData.desiredDate) : undefined}
                            onSelect={(date) => handleDateSelect('desiredDate', date)}
                            locale={ko}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="desiredSession" className="text-gray-700 font-medium mb-2 block">
                        희망 화장 회차 <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.desiredSession} onValueChange={(value) => handleInputChange("desiredSession", value)}>
                        <SelectTrigger className="h-12 text-base placeholder-small">
                          <SelectValue placeholder="회차를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[240px]">
                          {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={String(num)}>
                              {num}회차
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reservationOpenDate" className="text-gray-700 font-medium mb-2 block">
                        예약 오픈 일자
                      </Label>
                      <Popover open={reservationOpenDatePickerOpen} onOpenChange={setReservationOpenDatePickerOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-12 justify-between text-left font-normal text-base hover:bg-gray-50 transition-colors"
                          >
                            <span>
                              {formData.reservationOpenDate ? formatDateWithDay(formData.reservationOpenDate) : "년도-월-일"}
                            </span>
                            <CalendarIcon className="h-5 w-5 text-gray-500" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.reservationOpenDate ? new Date(formData.reservationOpenDate) : undefined}
                            onSelect={(date) => handleDateSelect('reservationOpenDate', date)}
                            locale={ko}
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-gray-500 mt-2">
                        정확한 일정을 모르시는 경우 입력하지 않으셔도 됩니다.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="reservationTime" className="text-gray-700 font-medium mb-2 block">
                        예약 오픈 시간
                      </Label>
                      <Input
                        id="reservationTime"
                        placeholder="예) 09:00:00"
                        value={formData.reservationTime}
                        onChange={(e) => handleInputChange("reservationTime", e.target.value)}
                        className="h-12 text-base"
                        maxLength={8}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        정확한 일정을 모르시는 경우 입력하지 않으셔도 됩니다.
                      </p>
                    </div>
                  </div>
                </div>

                {!showSecondChoice && (
                  <div className="mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowSecondChoice(true)}
                      className="w-full h-12 text-base font-medium border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      + 2순위 정보 추가
                    </Button>
                    <p className="text-xs text-gray-500 mt-2 text-left">
                      ※ 1순위 예약 실패 시 시도할 2순위 정보를 추가할 수 있습니다.
                    </p>
                  </div>
                )}

                {showSecondChoice && (
                  <>
                    <div className="pt-6 mt-6 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <div className="bg-indigo-50 rounded-lg px-4 py-2">
                          <h3 className="text-base font-semibold text-indigo-900">2순위 정보</h3>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setShowSecondChoice(false);
                            setFormData(prev => ({
                              ...prev,
                              districtType2: "",
                              region2: "",
                              crematorium2: "",
                              desiredDate2: format(new Date(), "yyyy-MM-dd"),
                              desiredSession2: "",
                              reservationOpenDate2: format(new Date(), "yyyy-MM-dd"),
                              reservationTime2: ""
                            }));
                          }}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          삭제
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-gray-700 font-medium mb-3 block">
                            관내/관외 구분
                          </Label>
                          <RadioGroup 
                            value={formData.districtType2} 
                            onValueChange={(value) => handleInputChange("districtType2", value)}
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="관내" id="district2-in" />
                              <Label htmlFor="district2-in" className="font-normal cursor-pointer">관내</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="관외" id="district2-out" />
                              <Label htmlFor="district2-out" className="font-normal cursor-pointer">관외</Label>
                            </div>
                          </RadioGroup>
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-xs text-gray-700 leading-relaxed">
                              예약하려는 화장장이 위치한 지역에 고인의 주민등록상 주소지가 있는 경우 <strong>관내</strong>. 그 외는 <strong>관외</strong>를 선택해주세요.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="region2" className="text-gray-700 font-medium mb-2 block">
                              지역 선택
                            </Label>
                            <Select value={formData.region2} onValueChange={(value) => handleInputChange("region2", value)}>
                              <SelectTrigger className="h-12 text-base placeholder-small">
                                <SelectValue placeholder="시, 도를 선택하세요" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="seoul">서울특별시</SelectItem>
                                <SelectItem value="busan">부산광역시</SelectItem>
                                <SelectItem value="daegu">대구광역시</SelectItem>
                                <SelectItem value="incheon">인천광역시</SelectItem>
                                <SelectItem value="gwangju">광주광역시</SelectItem>
                                <SelectItem value="daejeon">대전광역시</SelectItem>
                                <SelectItem value="ulsan">울산광역시</SelectItem>
                                <SelectItem value="sejong">세종특별자치시</SelectItem>
                                <SelectItem value="gyeonggi">경기도</SelectItem>
                                <SelectItem value="gangwon">강원특별자치도</SelectItem>
                                <SelectItem value="chungbuk">충청북도</SelectItem>
                                <SelectItem value="chungnam">충청남도</SelectItem>
                                <SelectItem value="jeonbuk">전북특별자치도</SelectItem>
                                <SelectItem value="jeonnam">전라남도</SelectItem>
                                <SelectItem value="gyeongbuk">경상북도</SelectItem>
                                <SelectItem value="gyeongnam">경상남도</SelectItem>
                                <SelectItem value="jeju">제주특별자치도</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="crematorium2" className="text-gray-700 font-medium mb-2 block">
                              화장장 이름
                            </Label>
                            <Select 
                              value={formData.crematorium2} 
                              onValueChange={(value) => handleInputChange("crematorium2", value)}
                              disabled={!formData.region2}
                            >
                              <SelectTrigger className="h-12 text-base placeholder-small">
                                <SelectValue placeholder={formData.region2 ? "화장장을 선택하세요" : "지역을 먼저 선택하세요"} />
                              </SelectTrigger>
                              <SelectContent>
                                {(formData.region2 ? crematoriumsByRegion[formData.region2] || [] : []).map((crematorium) => (
                                  <SelectItem key={crematorium.value} value={crematorium.label}>
                                    {crematorium.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="desiredDate2" className="text-gray-700 font-medium mb-2 block">
                              희망 화장 일정
                            </Label>
                            <Popover open={date2PickerOpen} onOpenChange={setDate2PickerOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full h-12 justify-between text-left font-normal text-base hover:bg-gray-50 transition-colors"
                                >
                                  <span>
                                    {formData.desiredDate2 ? formatDateWithDay(formData.desiredDate2) : "년도-월-일"}
                                  </span>
                                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={formData.desiredDate2 ? new Date(formData.desiredDate2) : undefined}
                                  onSelect={(date) => handleDateSelect('desiredDate2', date)}
                                  locale={ko}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div>
                            <Label htmlFor="desiredSession2" className="text-gray-700 font-medium mb-2 block">
                              희망 화장 회차
                            </Label>
                            <Select value={formData.desiredSession2} onValueChange={(value) => handleInputChange("desiredSession2", value)}>
                              <SelectTrigger className="h-12 text-base placeholder-small">
                                <SelectValue placeholder="회차를 선택하세요" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[240px]">
                                {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                                  <SelectItem key={num} value={String(num)}>
                                    {num}회차
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="reservationOpenDate2" className="text-gray-700 font-medium mb-2 block">
                              예약 오픈 일자
                            </Label>
                            <Popover open={reservationOpenDate2PickerOpen} onOpenChange={setReservationOpenDate2PickerOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full h-12 justify-between text-left font-normal text-base hover:bg-gray-50 transition-colors"
                                >
                                  <span>
                                    {formData.reservationOpenDate2 ? formatDateWithDay(formData.reservationOpenDate2) : "년도-월-일"}
                                  </span>
                                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={formData.reservationOpenDate2 ? new Date(formData.reservationOpenDate2) : undefined}
                                  onSelect={(date) => handleDateSelect('reservationOpenDate2', date)}
                                  locale={ko}
                                />
                              </PopoverContent>
                            </Popover>
                            <p className="text-xs text-gray-500 mt-2">
                              정확한 일정을 모르시는 경우 입력하지 않으셔도 됩니다.
                            </p>
                          </div>

                          <div>
                            <Label htmlFor="reservationTime2" className="text-gray-700 font-medium mb-2 block">
                              예약 오픈 시간
                            </Label>
                            <Input
                              id="reservationTime2"
                              placeholder="예) 09:00:00"
                              value={formData.reservationTime2}
                              onChange={(e) => handleInputChange("reservationTime2", e.target.value)}
                              className="h-12 text-base"
                              maxLength={8}
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              정확한 일정을 모르시는 경우 입력하지 않으셔도 됩니다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                추가 정보
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                * 표시된 항목은 필수 입력 사항입니다
              </p>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="howDidYouKnow" className="text-gray-700 font-medium mb-2 block">
                    패스트캐치를 알게 된 경로 <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.howDidYouKnow} onValueChange={(value) => handleInputChange("howDidYouKnow", value)}>
                    <SelectTrigger className="h-12 text-base placeholder-small">
                      <SelectValue placeholder="서비스를 알게 된 경로를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommendation">지인 추천</SelectItem>
                      <SelectItem value="funeral-community">장례업계 커뮤니티</SelectItem>
                      <SelectItem value="promotion-sms">홍보문자</SelectItem>
                      <SelectItem value="blog">블로그</SelectItem>
                      <SelectItem value="search">인터넷 검색</SelectItem>
                      <SelectItem value="sns">SNS (페이스북, 인스타그램 등)</SelectItem>
                      <SelectItem value="youtube">유튜브</SelectItem>
                      <SelectItem value="advertisement">광고</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="additionalRequest" className="text-gray-700 font-medium mb-2 block">
                    추가 요청사항
                  </Label>
                  <textarea
                    id="additionalRequest"
                    placeholder="추가로 전달하고 싶은 내용이 있다면 입력해주세요"
                    value={formData.additionalRequest}
                    onChange={(e) => handleInputChange("additionalRequest", e.target.value)}
                    className="w-full h-32 px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    특별한 요청사항이나 문의사항을 자유롭게 작성해주세요
                  </p>
                </div>

                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">패스트캐치 안내사항</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p className="leading-relaxed">
                      ① 패스트캐치는 높은 경쟁률 속에서도 성공률을 높이기 위해 최선을 다하고 있습니다.<br />
                      다만, 시스템 구조상 예약 실패 가능성도 존재하는 점 양해 부탁드립니다.
                    </p>
                    <p className="leading-relaxed">
                      ② 본 서비스는 후불 결제 방식으로 운영됩니다.<br />
                      예약 실패 시, 어떠한 비용도 청구되지 않으며, 예약 성공 시에만 성공수당을 입금해주시면 됩니다.
                    </p>
                    <p className="leading-relaxed font-medium">
                      원하시는 일정에 화장이 이루어질 수 있도록 최선을 다하겠습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="px-4 py-2 h-11 text-base sm:px-6 sm:py-3 sm:h-12"
              disabled={currentStep === 1}
            >
              이전
            </Button>
            <Button
              onClick={handleNext}
              className="px-5 py-2 h-11 text-base bg-blue-500 hover:bg-blue-600 sm:px-8 sm:py-3 sm:h-12"
            >
              {currentStep === 3 ? "신청 완료" : "다음"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
