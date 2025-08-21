// filepath: /workspaces/-/coupon-project/pages/index.js
import { useState } from 'react';

export default function Home() {
  const [uid, setUid] = useState('');
  const [couponsText, setCouponsText] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const coupons = couponsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    setResult('처리 중...');

    try {
      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, coupons }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResult(`오류: ${data.message}${data.invalidCoupons ? ' - 문제 쿠폰: ' + data.invalidCoupons.join(', ') : ''}`);
        return;
      }

      setResult(
        data.results
          .map(r => `${r.coupon}: ${r.message}`)
          .join('\n')
      );
    } catch {
      setResult('네트워크 오류 발생');
    }
  };

  return (
    <div>
      <h1>쿠폰 등록</h1>
      <form onSubmit={handleSubmit}>
        <label>UID: <input value={uid} onChange={e => setUid(e.target.value)} required /></label><br />
        <label>쿠폰 코드 (한 줄에 하나씩):</label><br />
        <textarea rows={5} value={couponsText} onChange={e => setCouponsText(e.target.value)} required /><br />
        <button type="submit">전송</button>
      </form>
      <pre>{result}</pre>
    </div>
  );
}