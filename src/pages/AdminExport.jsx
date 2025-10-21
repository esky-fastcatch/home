import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Reservation } from "@/api/entities";
import { Download, RefreshCw, Database, Copy, Check } from "lucide-react";
import { format } from "date-fns";

export default function AdminExport() {
  const { toast } = useToast();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [copied, setCopied] = useState(false);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const data = await Reservation.list('-created_date', 1000); // 최근 1000개
      setReservations(data);
      setLastUpdated(new Date());
      toast({
        title: "데이터 로드 완료",
        description: `${data.length}개의 예약 데이터를 불러왔습니다.`,
      });
    } catch (error) {
      console.error("Failed to load reservations:", error);
      toast({
        title: "데이터 로드 실패",
        description: "예약 데이터를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(reservations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reservations_${format(new Date(), 'yyyyMMdd_HHmmss')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "다운로드 완료",
      description: "JSON 파일이 다운로드되었습니다.",
    });
  };

  const handleDownloadCSV = () => {
    if (reservations.length === 0) {
      toast({
        title: "데이터 없음",
        description: "다운로드할 데이터가 없습니다.",
        variant: "destructive",
      });
      return;
    }

    // CSV 헤더
    const headers = [
      "예약번호", "서비스유형", "처리상태", "성공여부",
      "신청자명", "신청자전화번호", "신청자통신사",
      "고인명", "고인국적", "고인주민번호",
      "화장장", "희망일정", "희망회차", "예약시간",
      "화장장2", "희망일정2", "희망회차2", "예약시간2",
      "알게된경로", "추가요청사항",
      "생성일시", "수정일시"
    ];

    // CSV 데이터
    const csvData = reservations.map(r => [
      r.reservationNumber || '',
      r.serviceType || '',
      r.processingStatus || '',
      r.successStatus || '',
      r.applicantName || '',
      r.applicantPhoneNumber || '',
      r.applicantTelecom || '',
      r.deceasedName || '',
      r.deceasedNationality || '',
      r.deceasedResidentNumber || '',
      r.crematorium || '',
      r.desiredDate || '',
      r.desiredSession || '',
      r.reservationTime || '',
      r.crematorium2 || '',
      r.desiredDate2 || '',
      r.desiredSession2 || '',
      r.reservationTime2 || '',
      r.howDidYouKnow || '',
      r.additionalRequest || '',
      r.created_date || '',
      r.updated_date || ''
    ]);

    // CSV 문자열 생성
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // BOM 추가 (엑셀에서 한글 깨짐 방지)
    const BOM = '\uFEFF';
    const dataBlob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reservations_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "다운로드 완료",
      description: "CSV 파일이 다운로드되었습니다.",
    });
  };

  const handleCopyJSON = async () => {
    const dataStr = JSON.stringify(reservations, null, 2);
    try {
      await navigator.clipboard.writeText(dataStr);
      setCopied(true);
      toast({
        title: "복사 완료",
        description: "JSON 데이터가 클립보드에 복사되었습니다.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "데이터 복사 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-6 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                예약 데이터 관리
              </h1>
              <p className="text-sm text-gray-500">
                전체 예약 데이터를 조회하고 내보낼 수 있습니다
              </p>
            </div>
            <Button
              onClick={loadReservations}
              disabled={loading}
              variant="outline"
              className="h-10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">총 예약 수</p>
                  <p className="text-2xl font-bold text-gray-900">{reservations.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">접수완료</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reservations.filter(r => r.processingStatus === '접수완료').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">마지막 업데이트</p>
                  <p className="text-sm font-medium text-gray-900">
                    {lastUpdated ? format(lastUpdated, 'HH:mm:ss') : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              onClick={handleDownloadJSON}
              disabled={reservations.length === 0}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Download className="w-4 h-4 mr-2" />
              JSON 다운로드
            </Button>
            <Button
              onClick={handleDownloadCSV}
              disabled={reservations.length === 0}
              className="bg-green-500 hover:bg-green-600"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV 다운로드 (엑셀용)
            </Button>
            <Button
              onClick={handleCopyJSON}
              disabled={reservations.length === 0}
              variant="outline"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  복사됨
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  JSON 복사
                </>
              )}
            </Button>
          </div>

          {/* Data Preview */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">데이터 미리보기 (최근 10개)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">예약번호</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">서비스유형</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">신청자명</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">전화번호</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">화장장</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">희망일정</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.slice(0, 10).map((reservation, index) => (
                    <tr key={reservation.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-gray-900">{reservation.reservationNumber}</td>
                      <td className="px-4 py-3 text-gray-900">{reservation.serviceType}</td>
                      <td className="px-4 py-3 text-gray-900">{reservation.applicantName}</td>
                      <td className="px-4 py-3 text-gray-900">{reservation.applicantPhoneNumber}</td>
                      <td className="px-4 py-3 text-gray-900">{reservation.crematorium}</td>
                      <td className="px-4 py-3 text-gray-900">{reservation.desiredDate}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          {reservation.processingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {reservations.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  데이터가 없습니다
                </div>
              )}
            </div>
          </div>

          {/* API Info */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">💡 API 엔드포인트 정보</h4>
            <p className="text-xs text-gray-700 mb-2">
              base44 플랫폼의 엔티티는 자동으로 REST API를 제공합니다:
            </p>
            <div className="bg-white rounded p-3 font-mono text-xs space-y-1">
              <div><span className="text-green-600">GET</span> /api/entities/Reservation - 전체 조회</div>
              <div><span className="text-blue-600">GET</span> /api/entities/Reservation/:id - 단건 조회</div>
              <div><span className="text-yellow-600">POST</span> /api/entities/Reservation - 생성</div>
              <div><span className="text-purple-600">PUT</span> /api/entities/Reservation/:id - 수정</div>
              <div><span className="text-red-600">DELETE</span> /api/entities/Reservation/:id - 삭제</div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              ※ 인증 토큰이 필요합니다. 대시보드 → Settings에서 API 키를 발급받으세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}