import * as schema from "@mcc/schema/database";
import { eq } from "drizzle-orm";
import type { DrizzleSqliteDODatabase } from "drizzle-orm/durable-sqlite";

// 仮の投稿者名
const seedNames: Array<string | undefined> = [
	"たなか",
	"さとう",
	"すずき",
	"たかはし",
	"わたなべ",
	"いとう",
	"やまもと",
	"なかむら",
	"おばた",
	"まつもと",
	"いのうえ",
	"きむら",
	"はやし",
	"かつまた",
	"やまぐち",
	"かとう",
	"よしだ",
	"やまだ",
	"ささき",
	"やまざき",
	"こばやし",
	"ももり",
	"ひらの",
	"おかもと",
	"ながた",
	undefined,
	undefined,
	undefined,
];

// 仮の投稿内容
const seedContents: string[] = [
	"おはよ〜！今日も1日頑張ろう💪✨",
	"ラーメン食べたくなってきた🍜誰か一緒に行かない？",
	"コード書いてるとき、なんか無敵になった気分になるのって私だけ？😎",
	"TypeScript使い始めたら、もうJavaScriptに戻れない体になってしまった😅",
	"今日めっちゃ天気いいじゃん☀️お散歩日和だな〜",
	"カフェのWiFi遅すぎて泣きそう😭でもコーヒーは美味しい☕",
	"新しいライブラリ試してみたけど、ドキュメント読むのめんどくさい...でも楽しい！",
	"バグ直すのに3時間もかかった💀でもその分達成感がやばい🔥",
	"コードレビューもらったけど、指摘が的確すぎて逆に嬉しい😊ありがとう！",
	"明日早起きして散歩するぞ！って毎日言ってる気がする🚶‍♀️",
	"ReactとVue、どっちが好き？論争始めたくないけど気になる🤔",
	"DB設計してるとパズルゲームやってる気分になる🧩楽しい〜",
	"API設計で詰まってる...誰か助けて〜😵‍💫",
	"テスト書くのめんどくさいけど、書かないと後で絶対後悔するやつ😂",
	"パフォーマンス最適化って、数字が改善されると気持ち良すぎる📈",
	"ドキュメント書くの苦手だけど、未来の自分のために頑張る✍️",
	"チーム開発楽しい！みんなのコード見てるだけで勉強になる👥",
	"また新しいバグ見つけた...終わりが見えない😇",
	"リファクタリング完了！コードがスッキリして気持ちいい〜✨",
	"新機能のアイデア思いついた💡これは絶対面白くなる！",
	"セキュリティ勉強してるけど、知れば知るほど怖くなる🔒",
	"フロントエンドの技術進歩早すぎ！ついていくのに必死😵",
	"バックエンドも触ってみたけど、これはこれで面白いな🖥️",
	"DevOps？インフラ？なんか難しそうだけど興味ある🤖",
	"アルゴリズム問題解いてると時間忘れる⏰でも寝不足は良くない😴",
	"デザインパターン覚えるの大変だけど、使えるようになると嬉しい🎨",
	"きれいなコード書きたいけど、締切が近いとつい汚くなっちゃう😅",
	"ペアプロ楽しい！一人じゃ絶対思いつかないアイデア出てくる👫",
	"技術書読んでるけど、実際に手を動かさないと身につかないよね📚",
	"カンファレンス行ってみたい！でも人見知りだから緊張する😰",
	"OSS貢献したいけど、何から始めればいいかわからない💭",
	"今日書いたコード、なんか調子よかった気がする😏",
	"エラーハンドリング大事って頭ではわかってるけど...🤷‍♀️",
	"ユーザビリティ考えるのって、自分がユーザーになって考えるのが一番？🤔",
	"アクセシビリティって奥が深い...みんなが使いやすいものを作りたい♿",
	"スマホファーストって言うけど、デスクトップも忘れちゃダメよね📱💻",
	"レスポンシブ対応面倒だけど、できたときの達成感すごい📐",
	"PWA作ってみたい！アプリみたいなWebサイトって憧れる📱✨",
	"サーバーレス便利だけど、料金が心配になってくる💸",
	"マイクロサービス設計、理想と現実のギャップがえぐい😭",
	"Docker使い始めたけど、『動く！』ってなったときの感動よ🐳",
	"CI/CD回ったときの達成感、やみつきになりそう🔄",
	"監視ダッシュボード見てるだけで時間過ぎちゃう📊楽しい",
	"ログ解析してると、意外な発見があって面白い🔍",
	"自動化できるものは全部自動化したい🤖効率化だいじ",
	"クラウドサービス多すぎて選択肢に迷う☁️どれがいいの？",
	"DB重い...インデックス貼れば解決する？🗃️",
	"キャッシュ効いてる〜って思ったらバグでした😂",
	"可用性とパフォーマンスのバランス難しい⚖️",
	"障害対応で徹夜したけど、チームワークの良さを実感した🌙",
];

// 返信用の短いコンテンツ
const seedReplyContents: string[] = [
	"これは共感しかない😭",
	"わかりすぎる〜！！",
	"まじでそれ！",
	"うんうん、めっちゃわかる💯",
	"なるほど🤔勉強になる",
	"ありがとう〜！助かる✨",
	"これは良い👍",
	"おつかれさま〜🙏",
	"ファイト〜！📣",
	"すげ〜😳",
	"面白そう！やってみたい",
	"ほんとそれな",
	"激しく同意",
	"いいね〜✨",
	"お疲れ様でした🫡",
	"ナイス👏👏",
	"すごすぎる！尊敬する🙇‍♀️",
	"めっちゃ参考になった！",
	"天才の発想😎",
	"一緒に頑張ろ〜💪",
	"えっ、マジで？😲",
	"うらやま〜",
	"私もそう思ってた！",
	"気になる👀",
	"やば、それは大変だったね💦",
	"おめでとう🎉",
	"ドンマイ😅次頑張ろ",
	"懐かしい〜",
	"あるある😂",
	"なにそれ面白そう",
	"教えて教えて🙋‍♀️",
	"今度試してみる！",
	"センス良すぎ✨",
	"ほんと尊敬する",
	"私には無理そう😇",
	"がんばって〜応援してる📣",
	"結果気になる！",
	"続報待ってる👀",
	"羨ましすぎる😭",
	"さすがです！",
];

function getRandomElement<T>(items: T[]): T {
	if (items.length === 0) {
		throw new Error("items must be non-empty");
	}
	const index = Math.floor(Math.random() * items.length);
	const fallback = items[0] as T;
	return (items as Array<T | undefined>)[index] ?? fallback;
}

function getRandomNumber(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Durable Objects の SQLite(Drizzle) を使って初期データを投入する
 * 既にデータが存在する場合は何もしない（冪等）
 */
export async function seed(
	db: DrizzleSqliteDODatabase<typeof schema>,
): Promise<void> {
	// すべて同期トランザクションで実行
	db.transaction((tx) => {
		// 既存データ確認（1件でもあればスキップ）
		const existing = tx.query.posts.findFirst({}).sync();
		if (existing) {
			return; // 何もしない
		}

		const createdPostIds: string[] = [];

		// 50件のメイン投稿を作成
		for (let i = 0; i < 50; i++) {
			const name = getRandomElement(seedNames);
			const content = getRandomElement(seedContents);

			const inserted = tx
				.insert(schema.posts)
				.values({ name, content })
				.returning()
				.get();

			if (inserted) {
				createdPostIds.push(inserted.id);
			}
		}

		// ランダムに30%の投稿へ返信を1〜3件追加
		const replyTargetCount = Math.floor(createdPostIds.length * 0.3);
		for (let i = 0; i < replyTargetCount; i++) {
			const targetPostId = getRandomElement(createdPostIds);
			const replyCount = getRandomNumber(1, 3);

			for (let j = 0; j < replyCount; j++) {
				const name = getRandomElement(seedNames);
				const content = getRandomElement(seedReplyContents);
				tx.insert(schema.posts)
					.values({ name, content, parentId: targetPostId })
					.returning()
					.get();
			}
		}

		// 各投稿に0〜15のランダムいいね数を付与
		for (const postId of createdPostIds) {
			const likeCount = getRandomNumber(0, 15);
			tx.update(schema.posts)
				.set({ likes: likeCount })
				.where(eq(schema.posts.id, postId))
				.returning()
				.get();
		}
	});
}
