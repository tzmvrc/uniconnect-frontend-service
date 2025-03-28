/** @format */
import Leaderboard_icon from "../images/badgerank.png";

const LeaderboardsRules = () => {
 
  return (
    <aside className="w-[300px] fixed top-[85px] right-0 h-[calc(100vh-96px)] bg-white p-2 hidden md:block z-10">
      <div className="p-4 rounded-2xl border-[1px] border-black bg-[#FFCDA9] h-full">
        <h3 className="text-[30px] font-semibold mb-2 text-[#141E46]">
          Leaderboards
        </h3>
        <div className="flex justify-center mt-2">
          <img
            src={Leaderboard_icon}
            alt="Leaderboard"
            className="w-[110px] h-auto"
          />
        </div>
        <div className="text-left text-[12px]">
          <h2 class="font-bold mb-[8px] text-black">Instructions:</h2>
          <ul class="list-disc pl-5">
            <li>
              Points are earned based on the upvotes and downvotes your
              responses receive.
            </li>
            <li>
              Your points are calculated as:{" "}
              <span className="font-bold text-[#141E46]">
                (Total Upvotes - Downvotes) ÷ Number of Responses.
              </span>
            </li>
            <li>To earn a badge, you need to collect at least 100 points.</li>
          </ul>
          <h2 class="font-bold mb-[8px] mt-[30px] text-black">Tips:</h2>
          <ul class="list-disc pl-5">
            <li>
              Be sure to read the full question before responding, and aim to
              provide clear, helpful answers.
            </li>
            <li>
              Upvote responses you find useful to help others and reward quality
              contributions.
            </li>
            <li>
              Remember, thoughtful answers can earn you points and boost your
              ranking!
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default LeaderboardsRules;
