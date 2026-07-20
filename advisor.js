'use strict';

/* 「今日のアドバイス」生成エンジン（端末内で動作・日英対応）。
   - 断定的な効能表現を避け、「〜と言われています／〜とされています」等の
     一般的な情報紹介の形に統一（医療機器・薬機法まわりの誤解を避けるため）
   - 継続日数と年齢を参照する
   - 直近に出したものを避け、同じような内容が続かないようにする
   誕生日＋日付＋salt から決定的に生成するため、同じ日は同じ結果になり、
   「別のアドバイスに切り替え」を押すと別の組み合わせが出る。 */

const ADVISOR_JA = {
  MED: {
    s0: [
      '節酒を始めた直後は、まず「今日1日、上限を守る」ことだけを意識してみましょう。小さな達成の積み重ねが習慣になります。',
      '飲む量を減らし始めると、体が水分を欲しがりやすくなることがあります。お酒の合間に水を挟む「チェイサー」を意識してみましょう。',
      '急に大きく減らすことに不安がある場合や、長年多量に飲んできた方は、自己判断せず医師に相談しながら進めるのが安心です。',
      '「上限を決めよう」と決めたその決断自体が、すでに大きな一歩です。今日はまず、いつもよりゆっくりお風呂に浸かってみるのもおすすめです。',
    ],
    s1: [
      '節酒を始めて数日は、いつもより意識してお酒と向き合う時期です。上限を数える習慣が少しずつ身についてきます。',
      '飲む量を減らすと、寝つきや睡眠の質が変わってくると言われています。就寝前のスマホやカフェインを控えると、より眠りが深まりやすくなります。',
      '「今日は何杯まで」と決めておくだけで、実際の飲酒量が減りやすいという報告もあります。',
      '強いだるさや体調不良が続く場合は無理をせず、休める環境を優先してください。',
    ],
    s2: [
      '上限を意識する生活に少しずつ慣れてくる頃です。血圧や胃腸の調子が整い始める人も多いようです。消化に優しい食事を心がけましょう。',
      '飲みすぎない日が増えることで、翌朝のむくみやだるさが軽くなってきたと感じる人もいます。',
      '睡眠リズムが整いやすくなる時期です。日中に軽い運動や日光を取り入れると、体内時計が整いやすくなると言われています。',
      '「今日は上限内で楽しめた」という感覚が、少しずつ積み重なってきているはずです。',
    ],
    s3: [
      '1週間、上限を守れたことで睡眠が深まり、朝の目覚めの良さを感じ始める人が多いようです。カフェインを午後に避けると、睡眠の質がさらに安定しやすくなります。',
      '肝臓への負担が軽くなり始め、血糖値も安定しやすくなると言われています。3食を規則正しく摂ることが助けになります。',
      '肌の水分量が戻り、顔のむくみやくすみが軽くなってくると感じる人がいる頃です。鏡を見るのが少し楽しみになるかもしれません。',
      '「1週間、目標を守れた」という事実そのものが、今後続けていく大きな自信になります。ここまでの自分をねぎらってあげてください。',
    ],
    s4: [
      '2週間を超えると、血圧や中性脂肪の数値が落ち着いてくる人が多いと言われています。ウォーキングなど軽い有酸素運動を足すと相乗効果が期待できます。',
      '胃酸の分泌が整い、胸やけや胃のむかつきが減ってくる時期です。胃腸が本来の調子を取り戻しつつあると言われています。',
      '集中力や記憶のクリアさが戻ってきたと感じる人が多い頃です。新しい習慣や学びを始める好機かもしれません。',
      '味覚や嗅覚が敏感になったと感じる人もいます。いつもの食事が、少し違って感じられるかもしれません。',
    ],
    s5: [
      '1か月、上限を守り続けたことで、肝臓に溜まった脂肪が少しずつ減っていくと言われています。健康診断で肝機能の数値の改善を実感する人もいる時期です。',
      '飲みすぎによる余分なカロリーを抑えることで、体重や体脂肪が落ち着いてくる人が多いとされています。',
      '気分の波が穏やかになり、慢性的だった不安感やイライラが減ってきたという声もあります。',
      '「1ヶ月続けられた」という実績は、これから先も大きな支えになります。次の目標を考えてみるのも良いタイミングです。',
    ],
    s6: [
      '2か月を超えると、睡眠と栄養の土台が整い、体調を崩しにくくなると言われています。',
      '肝機能の数値がさらに改善しやすい時期とされています。定期的な血液検査で成果を「見える化」すると、継続の励みになります。',
      '運動や新しい趣味に前向きに取り組める余裕が出てくる人が多い頃です。上限内で過ごす時間の使い方を広げてみましょう。',
      '周囲の人から「顔つきが変わった」と言われる人もいる時期です。変化は自分より先に、周りが気づくことがあります。',
    ],
    s7: [
      '3か月は大きな節目です。肝臓の脂肪が大幅に減り、脂肪肝の改善が期待できると言われています。血圧や血糖の安定も続きやすい時期です。',
      '上限を守る習慣が定着し、飲みすぎたいという衝動が自然と弱まってくる人が増える頃だとされています。ここまでの継続が土台になっています。',
      '睡眠・食欲・気分のバランスが総合的に整ってきたと感じる人が多い時期です。',
      '「上限を超えたいと思わなくなってきた」という感覚が芽生え始める人もいます。焦らず、この調子を大切にしてください。',
    ],
    s8: [
      '半年、上限を守り続けたことで、心臓や血管への負担が減り、心血管系のリスクが着実に下がってくると言われています。運動習慣を組み合わせるとさらに良い相乗効果が期待できます。',
      '肝臓は再生力の高い臓器だとされています。ここまでの継続で、多くの機能が着実に回復に向かっていると考えられます。',
      '人間関係や仕事のパフォーマンスにも良い変化を感じる人が多い時期です。節酒がもたらす影響は、体だけにとどまらないようです。',
      '半年前の自分と今の自分を比べてみると、想像以上に変わっていることに気づくかもしれません。',
    ],
    s9: [
      '1年以上、節酒を続けることは、高血圧やいくつかの生活習慣病のリスク低下につながると報告されています。心から称賛に値する積み重ねです。',
      '長期にわたる節酒によって、睡眠・気分・人間関係の質までもが総合的に向上したと感じる人が多くいます。',
      'ここまで来ると、上限を守ることはもう「我慢」ではなく「当たり前の習慣」になっている人が多いようです。それ自体が大きな達成です。',
      '長く続けてきたからこそ見える景色があります。ここまでの自分に、あらためて拍手を送ってください。',
    ],
  },
  AGE: {
    young: [
      '若いうちに飲酒量をコントロールする習慣を身につけることは、将来の肝臓や脳への負担を減らす投資になると言われています。',
      '20代は体の回復力が高い一方で、習慣が定着しやすい時期でもあります。今日の選択が、10年後の自分につながっていきます。',
      '若い世代ほど、節酒による肌や体調の変化を早く実感しやすいという声もあります。',
      '学業や仕事、人間関係が大きく動くこの時期に、お酒に流されない自分の軸を作れるのは大きな財産です。',
      '同世代には「飲むのが当たり前」という空気があるかもしれませんが、自分のペースを守る勇気こそが今のあなたを強くしています。',
      '若いうちからの節酒は、将来かかる医療費や失う時間を大きく減らす選択でもあると言われています。',
    ],
    a30: [
      '30代は仕事や付き合いで飲む機会が増えがちです。上限を決めて飲むことは睡眠の質と日中の集中力に直結すると言われています。',
      '代謝が少しずつ変わり始める30代。飲みすぎを減らして浮いた時間とお金を、自分の健康投資に回してみましょう。',
      'キャリアの重要な時期でもある30代、素面でいる時間が増えることで判断力や体力が安定しやすくなります。',
      '家庭やパートナーとの時間が増える人も多い時期です。節酒がもたらす穏やかな時間を、大切な人と過ごしてみてください。',
      '30代からの節酒は、40代以降の健康診断の数値に良い影響を与えやすいとされています。',
      '「そろそろ体を大事にしないと」と感じ始める人が多い年代です。その直感を、今日も一歩前に進めましょう。',
    ],
    a40: [
      '40代は肝機能や血圧に変化が出やすい年代だと言われています。飲酒量を抑えることはこれらの数値改善に特に効果を発揮しやすいとされています。',
      '40代の節酒は、生活習慣病の予防という観点でも価値の大きい選択です。',
      '仕事の責任が増えるこの時期、素面でいる時間の判断力の安定は大きな武器になります。',
      '子どもや家族との時間の質にも、節酒は良い影響を与えると感じる人が多いようです。',
      '体力の変化を感じ始める人も多い年代ですが、節酒はその変化を穏やかにする助けになると言われています。',
      'これからの人生の後半戦を見据えて、今日の選択が体への何よりの投資になります。',
    ],
    a50: [
      '50代は肝臓の回復に少し時間がかかることもありますが、節酒の効果は着実に表れると言われています。焦らず継続を。',
      '睡眠が乱れやすくなる年代です。飲む量を抑えることで、夜間に目が覚める回数が減る人が多くいます。',
      'この年代からの節酒でも、血圧やコレステロールの数値に良い変化が出ることは十分期待できると言われています。',
      '定年後や次のライフステージを見据えて、体調を整えておくことの価値がより大きくなる時期です。',
      '長年の習慣を変えるのは簡単ではありません。それでも今日ここまで続けてこられたことは、誇っていいことです。',
      '家族や孫との時間をより元気に過ごすための、今からの積み重ねです。',
    ],
    senior: [
      'シニア世代はアルコールの影響を受けやすいと言われており、飲酒量を抑えることは転倒予防や薬との相互作用の面でも安心につながります。',
      '年齢を重ねてからの節酒でも、睡眠・認知機能・バランス感覚の改善が期待できると言われています。無理のない範囲で続けましょう。',
      'これまでの人生経験があるからこそ、節酒の意味や価値を深く実感できているのではないでしょうか。',
      '服用中の薬がある方は、アルコールとの相互作用が減ることで、薬の効果がより安定しやすくなると言われています。',
      '何歳からでも、体は変化に応える力を持っていると言われています。今日の一歩が、その力を後押しします。',
      'これまで積み重ねてきた人生の知恵を、これからの節酒の日々にも活かしていってください。',
    ],
    unknown: [
      '設定で生年月日を登録すると、あなたの年代に合わせたアドバイスをお届けできます。',
      '年代に合った助言のために、よければ設定から生年月日を入力してみてください。',
      '生年月日は占いにも使われます。入力すると、より個人に合わせた内容が楽しめます。',
      '生年月日の入力は任意です。空欄のままでも、今日のアドバイスは引き続きお届けします。',
    ],
  },
  TRIVIA: [
    'アルコールは「寝つきを良くする」と思われがちですが、実は睡眠の後半を浅くし、夜中の目覚めを増やすと言われています。',
    'ビール中びん1本(約500ml)は、ごはん約1杯分に近いカロリーとされています。飲む量を控えることはダイエットの近道にもなり得ます。',
    '「とりあえず一杯」を我慢すると、多くの場合15〜20分ほどで飲みたい気持ちの波は引いていくと言われています。',
    '肝臓は「沈黙の臓器」と呼ばれます。かなり傷んでも症状が出にくいため、数値での定期チェックが大切だとされています。',
    'アルコールを分解する速さには大きな個人差があり、遺伝的に「お酒に弱い」人は一部のリスクが高いとする報告があります。',
    '純アルコール量に換算すると、ビール中瓶1本・日本酒1合・ワイングラス2杯はほぼ同じ量（約20g）とされています。「杯数」だけでなく「純アルコール量」で意識すると、上限管理がしやすくなります。',
    '喉の渇きを「飲みたい」と勘違いすることがあります。まず水を一杯飲むと、衝動がすっと収まることもあるようです。',
    'アルコールには利尿作用があり、飲むほど体は脱水に傾きやすいと言われています。翌朝のだるさの一因とされています。',
    '上限を「杯数」だけでなく「時間」で決める人もいます。例えば「20時以降は飲まない」のように区切ると、上限を守りやすくなることがあるようです。',
    '炭酸水やノンアルコール飲料を「儀式」として置き換えると、手持ち無沙汰からくる飲みたさが和らぐことがあります。',
    '飲み会は最初の30分が山場と言われます。ソフトドリンクを手に持っておくと、お酒を勧められにくくなるようです。',
    'アルコールはレム睡眠を減らし、記憶の定着を妨げるとされています。学びの多い日ほど節酒が味方になるかもしれません。',
    '日本人の一定数は、アルコールを分解する酵素の働きが生まれつき弱い体質だと言われています。',
    '飲みすぎを控える生活を続けると、肌のくすみ・むくみの改善に2〜4週間ほどで気づく人が多いようです。',
    '「飲みたい」の多くは、ストレスや退屈が引き金になっていると言われています。別の行動に置き換えると衝動は弱まることがあります。',
    'グラス1杯のワインにも数十kcal。飲む量を1年間抑え続けると、数万kcal分の節約になることもあると言われています。',
    'お酒に含まれる「エンプティカロリー」は栄養がほとんどなく、体に脂肪として蓄積されやすいとされています。',
    '飲酒量を減らし始めた数日は「頭がすっきりしない」と感じる人がいますが、これは一時的な適応反応であることが多いようです。',
    'お酒の席での会話の多くは、実は素面でも十分楽しめると気づく人が少なくないと言われています。',
    'アルコールは体温調節にも影響すると言われ、飲んだ夜に体が火照って寝苦しく感じることがあるようです。',
    '「乾杯だけ」のつもりが飲み続けてしまう背景には、最初の一杯が判断力を緩めてしまう作用があるとされています。',
    '飲みすぎを控える習慣を続けている人の多くが、数ヶ月後に「以前より肌の調子がいい」と実感すると言われています。',
    'お酒の代わりにハーブティーやノンアルコール飲料を選ぶ人が、近年少しずつ増えているようです。',
    '「今日は飲まない日」と決めておくだけで、実際に飲酒量が減りやすいという報告もあります。',
    'アルコールへの耐性は年齢とともに下がる傾向があり、若い頃と同じ量でも影響が大きく出やすくなると言われています。',
    '節酒の記録を続けること自体が、達成感を積み重ねて習慣化を助けると言われています。',
  ],
  TIP: [
    '今日は飲みたくなったら、まず冷たい炭酸水を一杯どうぞ。',
    '衝動が来たら5分だけ散歩してみましょう。波はきっと引いていきます。',
    '今日の気分を「記録」タブに残すと、続ける力になります。',
    '夜の時間を持て余したら、いつもと違うお茶を試してみてください。',
    'ゆっくり深呼吸を3回。それだけで衝動の強さは変わります。',
    '飲みたくなったら、我慢した先にある「明日のスッキリした朝」を想像してみましょう。',
    '手持ち無沙汰なときは、温かい飲み物をゆっくり味わってみて。',
    '今日を達成できたら、お酒以外の小さなご褒美を自分にあげましょう。',
    '今日は好きな音楽をかけながら、いつもと違う夜を過ごしてみましょう。',
    '飲みたくなったら、その気持ちを紙に書き出してみると、少し落ち着くことがあります。',
    'お気に入りのカフェで、ノンアルコールドリンクを試してみるのもおすすめです。',
    '今日は少し早めにベッドに入って、体をしっかり休めてあげましょう。',
    '誰かに「今日も上限を守れた」と伝えてみると、それが小さな支えになります。',
    '衝動が来たら、冷たいシャワーを浴びるのも気分を切り替える一つの方法です。',
    '今日、上限を守れたことは、明日のあなたへの一番のプレゼントです。',
    '好きな香りのアロマやお茶で、リラックスできる時間を作ってみてください。',
    '少し体を動かすだけでも、気分が変わることがあります。軽いストレッチはいかがですか。',
    '今日できたことを1つでいいので、自分で自分を褒めてあげましょう。',
  ],
  CLOSING: [
    '一日ずつで大丈夫。あなたはよくやっています。',
    '今日の一歩が、確かな回復につながっています。',
    '無理せず、あなたのペースで。',
    '未来のあなたが、今日の選択にきっと感謝します。',
    'あなたのペースで、今日も進んでいきましょう。',
    '続けているだけで、もう十分にすごいことです。',
    '今日の自分を、誇りに思ってください。',
    '小さな積み重ねが、いつか大きな自信になります。',
    '昨日より少しだけ、今日は軽やかかもしれません。',
    '迷った日があってもいい。それでも続けていることが大切です。',
    'あなたの一歩を、これからも応援しています。',
    '焦らなくて大丈夫。今日という日を、大切に。',
    'その調子です。ゆっくりでいいので、進んでいきましょう。',
    '今日という日は、二度と来ません。大切に過ごしてください。',
    'これからも、一緒に一歩ずつ進んでいきましょう。',
  ],
  head(days, label) {
    if (days <= 0) return label ? `節酒スタート、${label}のあなたへ。` : '節酒スタート。よく決心しました。';
    return label ? `節酒 ${days} 日目、${label}のあなたへ。` : `節酒 ${days} 日目のあなたへ。`;
  },
  triviaLabel: '💡 豆知識: ',
  ageLabel(age) {
    if (age == null) return null;
    if (age < 20) return '10代';
    if (age < 30) return '20代';
    if (age < 40) return '30代';
    if (age < 50) return '40代';
    if (age < 60) return '50代';
    if (age < 70) return '60代';
    return '70代以上';
  },
};

const ADVISOR_EN = {
  MED: {
    s0: [
      'Right when you start moderating, the main thing is just staying within today’s limit. Small wins like this build into a lasting habit.',
      'As you cut back, your body may crave more fluids than usual. Alternating a glass of water between drinks (a “chaser”) can help.',
      'If you’re anxious about cutting back, or you’ve been a heavy drinker for a long time, it’s safest to check in with a doctor as you go.',
      'Deciding to set a limit is already a big step on its own. Try a slow, warm bath today as a small way to look after yourself.',
    ],
    s1: [
      'The first couple of days of tracking are about getting used to paying closer attention to your drinking. Counting your drinks will start to feel natural soon.',
      'Cutting back is said to change how well and how deeply you sleep. Skipping screens and caffeine before bed can help even more.',
      'Simply deciding "how many today" in advance is linked in some reports to actually drinking less.',
      'If you feel unusually unwell, don’t push through — prioritize rest and a calm environment.',
    ],
    s2: [
      'You’re starting to settle into the rhythm of watching your limit. Blood pressure and digestion often begin to steady around now. Favor easy-to-digest meals for now.',
      'As drinking-too-much days become less frequent, some people notice next-morning puffiness and fatigue easing.',
      'Sleep rhythms can be bumpy for a few days. Light daytime exercise and sunlight are said to help reset your body clock.',
      'The feeling of "I enjoyed myself and stayed within my limit" is quietly starting to add up.',
    ],
    s3: [
      'A week of staying within your limit is said to deepen sleep for many people, with mornings starting to feel genuinely better.',
      'The strain on your liver starts easing, with blood sugar becoming steadier. Regular meals three times a day are thought to help.',
      'Skin hydration often returns and puffiness or dullness starts lifting for some people around now. The mirror might become a little more fun.',
      'The fact that you kept your goal for a full week is real proof you can keep going. Take a moment to acknowledge that.',
    ],
    s4: [
      'Past two weeks, many people report lower blood pressure and improving triglycerides. Adding light cardio like walking may add a nice boost.',
      'Stomach acid regulation is said to improve, easing heartburn or queasiness. Your digestive system is finding its rhythm again.',
      'Many people notice sharper focus and clearer memory around now. It could be a good moment to start a new habit or learn something.',
      'Taste and smell can feel more vivid for some people at this stage. Your usual meals might taste a little different.',
    ],
    s5: [
      'A month of staying within your limit is said to gradually reduce fat stored in the liver. Some people notice improving liver panel numbers around a checkup at this stage.',
      'Cutting back on the extra calories from overdrinking often helps weight and body fat settle for many people at this point.',
      'Mood swings tend to smooth out, and many people report less of the chronic anxiety and irritability they used to feel.',
      'Making it a full month is a real achievement that will keep supporting you going forward. It might be a good time to set your next goal.',
    ],
    s6: [
      'Past two months, better sleep and nutrition are said to strengthen the body, making you less likely to get run down.',
      'Liver values are said to keep improving in this period for many people. Regular blood tests make the progress visible — great motivation.',
      'Many people find more energy for exercise or new hobbies around now. It’s a good time to put that renewed energy into something new.',
      'Some people are told by others that they “look different” at this stage — change is sometimes noticed by others before yourself.',
    ],
    s7: [
      'Three months is a real milestone. Liver fat is said to be greatly reduced for many people, with fatty liver often improving. Blood pressure and blood sugar tend to stay steadier too.',
      'Staying within your limit becomes more automatic, and the urge to overdo it naturally weakens for many people around now. Your consistency built this.',
      'Sleep, appetite and mood often feel more balanced overall at this stage for many people.',
      'Some people notice they’ve simply stopped wanting to go over their limit. Take it slow and protect this rhythm.',
    ],
    s8: [
      'Half a year of staying within your limit is said to reduce strain on the heart and blood vessels, steadily lowering cardiovascular risk for many people. Pairing it with exercise may help even more.',
      'The liver is described as a remarkably regenerative organ. With this much consistency, many of its functions are thought to be steadily recovering.',
      'Many people notice positive changes in relationships and work performance at this stage — the effects of moderating don’t seem to stop at the body.',
      'Compare who you were six months ago with who you are now — the distance may surprise you.',
    ],
    s9: [
      'Over a year of moderating your drinking is linked in reports to lower risk of high blood pressure and several lifestyle-related conditions. This is an accomplishment worth genuine pride.',
      'Long-term moderation is often described as improving sleep, mood and even the quality of relationships — the benefits seem to compound.',
      'At this point, for many people staying within their limit stops feeling like restraint and simply becomes normal life. That shift is itself a major achievement.',
      'There’s a view only visible from this far along the road. Give yourself real credit for reaching it.',
    ],
  },
  AGE: {
    young: [
      'Learning to manage how much you drink while you’re young is said to be a real investment in your future liver and brain.',
      'Your twenties bring high resilience but also fast habit formation. Today’s choice shapes who you are in ten years.',
      'Younger people are said to notice skin and body changes from moderating a little faster than others.',
      'With so much shifting in school, work and relationships right now, building a sense of self that doesn’t depend on drinking is a real asset.',
      'Your peers may treat heavy drinking as the default, but the courage to set your own pace is exactly what’s making you stronger today.',
      'Moderating early is also said to reduce the time and money that heavier drinking later in life would otherwise cost you.',
    ],
    a30: [
      'Your thirties tend to bring more work drinks and social pressure. Sticking to a limit is said to directly improve sleep and daytime focus.',
      'Metabolism starts shifting in your thirties. Reinvest the time and money you save from drinking less into your health.',
      'In this pivotal career decade, staying clear-headed more often tends to make judgment and stamina more stable.',
      'Many people in their thirties gain more time with family or a partner — enjoy the calmer time moderation can bring with the people who matter.',
      'Moderating in your thirties is said to positively influence checkup numbers well into your forties and beyond.',
      'Many people start feeling “it’s time to take care of myself” around this age. Follow that instinct one more day today.',
    ],
    a40: [
      'In your forties, liver values and blood pressure are said to start shifting more easily. Cutting back on drinking is described as especially effective at improving those numbers.',
      'Moderating in your forties is also a high-value move for preventing lifestyle-related conditions down the road.',
      'With more responsibility at work in this decade, the steadier judgment that comes from staying clear-headed is a real advantage.',
      'Many people notice moderation improves the quality of time spent with kids or family.',
      'Physical changes are common at this age, and cutting back on alcohol is said to help ease that transition.',
      'With the second half of life ahead, today’s choice is one of the best investments you can make in your body.',
    ],
    a50: [
      'In your fifties the liver can take a little longer to recover, but the benefits of moderating are said to arrive reliably. No rush — just keep going.',
      'Sleep gets more fragile at this age. Many people find they wake up far less at night once they cut back on alcohol.',
      'Even starting from this age, positive changes in blood pressure and cholesterol are well within reach, based on general reports.',
      'With retirement or a new life stage ahead, keeping your body in good shape carries even more value now.',
      'Changing a long-held habit isn’t easy. Making it this far is genuinely something to be proud of.',
      'This is an investment in having more energy for time with family and grandchildren ahead.',
    ],
    senior: [
      'Older adults are said to feel alcohol’s effects more strongly — cutting back is also linked to fewer falls and safer medication use.',
      'Even moderating later in life is said to improve sleep, cognition and balance. Keep it sustainable and steady.',
      'Your life experience likely lets you appreciate the meaning of this choice more deeply than most.',
      'If you take regular medication, fewer interactions with alcohol are said to help those medications work more reliably.',
      'The body is said to retain the capacity to respond to change at any age. Today’s step helps carry that forward.',
      'Bring the wisdom of everything you’ve learned in life into these days of moderating.',
    ],
    unknown: [
      'Add your birth date in Settings and the advice here will be tailored to your age.',
      'For age-specific guidance, consider entering your birth date in Settings.',
      'Your birth date is also used for the tarot feature — adding it unlocks more personalized content.',
      'Your birth date is optional. Today’s advice keeps working fine even if you leave it blank.',
    ],
  },
  TRIVIA: [
    'Alcohol seems to help you fall asleep, but it’s said to actually make the second half of the night shallower and wake you more often.',
    'A pint of beer is said to carry roughly the calories of a bowl of rice. Cutting back can be a shortcut for weight control too.',
    'Ride out the "just one drink" urge and it’s said to usually fade within 15–20 minutes.',
    'The liver is described as a "silent organ" — it rarely complains even when damaged, which is why regular checkups are said to matter.',
    'People vary hugely in how fast they break down alcohol, and some reports link certain genetic variants to higher risk.',
    'One beer, one cup of sake, and a small glass of wine are all said to carry roughly the same amount of pure alcohol (~14g). Thinking in "units" rather than just "drinks" can make it easier to track your limit.',
    'Thirst is often mistaken for a craving. Drinking a glass of water first is said to sometimes make the urge dissolve.',
    'Alcohol is a diuretic: the more you drink, the more dehydrated your body is said to become. It’s considered a big reason mornings-after feel awful.',
    'Some people find it easier to set a limit by time rather than count — like "no drinks after 8pm" — which can make sticking to a limit feel more natural.',
    'Swapping in sparkling water or alcohol-free drinks as a "ritual" is said to ease the restless urge to hold a drink.',
    'The first 30 minutes of a party are said to be the hardest. Holding a soft drink is said to make people less likely to offer you alcohol.',
    'Alcohol is said to suppress REM sleep and interfere with memory consolidation — moderating may be an ally on days you learn a lot.',
    'A meaningful share of people carry a gene variant that weakens alcohol metabolism from birth.',
    'Cutting back on drinking is said to typically show up as less dullness and puffiness in the skin within 2–4 weeks.',
    'Most cravings are said to be triggered by stress or boredom. Swapping in another activity is said to reliably weaken the urge.',
    'Even one glass of wine has dozens of calories. Cutting back consistently for a year is said to add up to tens of thousands of calories saved.',
    '"Empty calories" in alcohol carry little nutrition and are said to be stored as fat relatively easily.',
    'Feeling mentally foggy for the first few days is common and usually described as a temporary adjustment, not a lasting effect.',
    'Many people are surprised to find they enjoy social conversation just as much without a drink in hand.',
    'Alcohol is said to affect body temperature regulation, which is part of why a drinking night can leave you feeling too warm to sleep well.',
    'The slide from "just one toast" into drinking more is said to happen partly because that first drink loosens judgment itself.',
    'Many people who moderate their drinking for a few months report noticeably better skin.',
    'More people are said to be reaching for herbal tea or alcohol-free drinks as a substitute in recent years.',
    'Simply deciding in advance "today is an alcohol-free day" is linked in some reports to actually drinking less.',
    'Tolerance to alcohol is said to decline with age, so the same amount can hit harder than it used to.',
    'Keeping a daily log is itself said to reinforce the sense of progress that helps a new habit stick.',
  ],
  TIP: [
    'If a craving hits today, pour yourself a cold sparkling water first.',
    'When the urge comes, walk for just five minutes. The wave will pass.',
    'Logging today’s mood in the Log tab genuinely strengthens the streak.',
    'If the evening feels long, try a tea you’ve never had before.',
    'Three slow, deep breaths. That alone changes the strength of an urge.',
    'When you want a drink, picture tomorrow’s clear-headed morning — it’s on the other side of tonight.',
    'Restless hands? Slowly savor a warm drink instead.',
    'If you make it through today, give yourself a small non-alcohol reward.',
    'Put on music you love and let tonight feel a little different.',
    'Writing the craving down on paper can help take some of its weight away.',
    'Try a non-alcoholic drink at your favorite café — it might become a new favorite.',
    'Head to bed a little earlier tonight and let your body properly rest.',
    'Telling someone "I stayed within my limit today" can be a small but real source of support.',
    'A cold shower can be a surprisingly effective way to reset a craving.',
    'Staying within today’s limit is the best gift you can give tomorrow’s you.',
    'Light a favorite-scented candle or brew a calming tea and give yourself a moment to unwind.',
    'Even a little movement can shift your mood — how about a light stretch?',
    'Pick one thing you did today and genuinely give yourself credit for it.',
  ],
  CLOSING: [
    'One day at a time is enough. You’re doing well.',
    'Today’s step is real recovery in motion.',
    'Go at your own pace — no forcing it.',
    'Future you will be grateful for today’s choice.',
    'Keep moving forward today, at whatever pace works for you.',
    'Just by continuing, you’re already doing something remarkable.',
    'Be proud of who you were today.',
    'Small, steady steps eventually become real confidence.',
    'Today might feel a little lighter than yesterday.',
    'It’s okay to have wavering days — what matters is that you keep going.',
    'Your progress is worth cheering for, today and every day.',
    'No need to rush. Just take care of today.',
    'You’re doing great — keep going, gently, at your own speed.',
    'Today will never come again. Make the most of it.',
    'Let’s keep taking it one step at a time, together.',
  ],
  head(days, label) {
    if (days <= 0) return label ? `Starting your moderation journey — for you, ${label}.` : 'Day zero. That decision took courage.';
    return label ? `Day ${days} within your goal — for you, ${label}.` : `Day ${days} within your goal.`;
  },
  triviaLabel: '💡 Did you know: ',
  ageLabel(age) {
    if (age == null) return null;
    if (age < 20) return 'in your teens';
    if (age < 30) return 'in your 20s';
    if (age < 40) return 'in your 30s';
    if (age < 50) return 'in your 40s';
    if (age < 60) return 'in your 50s';
    if (age < 70) return 'in your 60s';
    return 'in your 70s or beyond';
  },
};

function stageKey(days) {
  if (days <= 0) return 's0';
  if (days <= 2) return 's1';
  if (days <= 6) return 's2';
  if (days <= 13) return 's3';
  if (days <= 29) return 's4';
  if (days <= 59) return 's5';
  if (days <= 89) return 's6';
  if (days <= 179) return 's7';
  if (days <= 364) return 's8';
  return 's9';
}

function ageGroup(age) {
  if (age == null) return 'unknown';
  if (age < 30) return 'young';
  if (age < 40) return 'a30';
  if (age < 50) return 'a40';
  if (age < 60) return 'a50';
  return 'senior';
}

/* 直近に使ったものを避けて選ぶ */
function pick(pool, rand, history, keep) {
  let avail = pool.filter(s => !history.includes(s));
  if (avail.length === 0) avail = pool.slice();
  const s = avail[Math.floor(rand() * avail.length)];
  history.push(s);
  while (history.length > keep) history.shift();
  return s;
}

function ageFrom(birthDate) {
  if (!birthDate) return null;
  const b = new Date(birthDate), t = new Date();
  if (isNaN(b)) return null;
  let a = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--;
  return (a >= 0 && a < 130) ? a : null;
}

/* history はステップ別の配列を持つオブジェクト（永続化される）。破壊的に更新する。 */
function generate({ days, age, date, salt = 0, history, lang = 'ja' }) {
  const C = lang === 'en' ? ADVISOR_EN : ADVISOR_JA;
  history = history || {};
  for (const k of ['med', 'age', 'trivia', 'tip', 'closing']) if (!history[k]) history[k] = [];

  const rand = Util.rng(Util.hashSeed(`${date}|${salt}|${age == null ? 'x' : age}|${days}`));
  const grp = ageGroup(age);
  const label = C.ageLabel(age);

  /* keepは各プールのサイズより少なめにする（同じ数だと「直近を除外」が
     常に空振りしてフォールバックし続け、実質ただの毎回コインフリップになるため） */
  const med = pick(C.MED[stageKey(days)], rand, history.med, 2);      // 各stageのプールは4件
  const ageNote = pick(C.AGE[grp], rand, history.age, 3);             // 各グループ4〜6件
  const trivia = pick(C.TRIVIA, rand, history.trivia, 12);            // 全26件
  const tip = pick(C.TIP, rand, history.tip, 8);                      // 全18件
  const closing = pick(C.CLOSING, rand, history.closing, 7);          // 全15件

  const text =
    `${C.head(days, label)}\n\n` +
    `🌿 ${med}\n\n` +
    `${ageNote}\n\n` +
    `${C.triviaLabel}${trivia}\n\n` +
    `${tip} ${closing}`;

  return { text };
}

window.Advisor = { generate, ageFrom };
