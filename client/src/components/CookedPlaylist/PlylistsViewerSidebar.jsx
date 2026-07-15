export default function PlaylistsViewerSidebar({
	currentPlaylist,
	activeSelection,
	onTopicSelect,
	matchedSyllabusTopics,
	unmatchedSyllabusTopics
}) {
	let tempMatchedSyllabusTopics = matchedSyllabusTopics;

	tempMatchedSyllabusTopics = ['Types of Machine Learning', 'Supervised Learning', 'Linear Regression']

	return (
		<aside className="w-64 shrink-0 border-r border-slate-200 flex flex-col overflow-hidden">
			<div className="p-4 border-b border-slate-200">
				<p className="text-[11px] uppercase tracking-widest text-slate-400">
					Units
				</p>
			</div>

			<nav className="flex-1 overflow-y-auto py-2">
				{currentPlaylist?.units.map(
					(unit, unitIndex) => (
						<div key={unit.id} className="mb-4">
							<p className="px-4 mb-2 text-[10px] uppercase tracking-wider text-slate-400">
								{unit.unitName}
							</p>

							{unit.topics.map((topic, topicIndex) => {
								const isActive = activeSelection.unitIndex === unitIndex
									&& activeSelection.topicIndex === topicIndex;

								return (
									<button
										key={topic.id}
										onClick={() => onTopicSelect(unitIndex, topicIndex)}
										className={`w-full flex items-start gap-2.5 px-4 py-2.5 text-left border-l-[2.5px] transition-colors
                          ${isActive
												? "border-slate-900 bg-slate-100"
												: "border-transparent hover:bg-slate-50"
											}`}
									>
										<span
											className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0
                            ${isActive ? "bg-slate-900" : "bg-slate-400"
												}`}
										/>
										<span
											className={`text-xs leading-snug w-full
                            ${isActive ? "text-slate-900 font-medium" : "text-slate-500"
												}`}
										>
											{topic.topicName}
											{
												isActive && (<>
													<div className="mt-2 ml-2 space-y-1">
														{tempMatchedSyllabusTopics?.map((matchedTopic, index) => (
															<div
																key={index}
																className="flex items-center gap-2 text-[10px]"
															>
																<span className="flex-1 break-words text-[11px]">
																	{matchedTopic}
																</span>

																<span className="h-1 w-1 rounded-full shrink-0 bg-green-500" />
															</div>
														))}
													</div>
													<div className="mt-2 ml-2 space-y-1">
														{unmatchedSyllabusTopics?.map((unmatchedTopic, index) => (
															<div
																key={index}
																className="flex items-center gap-2 text-[10px]"
															>
																<span className="flex-1 break-words text-[11px]">
																	{unmatchedTopic}
																</span>

																<span className="h-1 w-1 rounded-full shrink-0 bg-red-500" />
															</div>
														))}
													</div>
												</>)
											}
										</span>
									</button>
								);
							}
							)}
						</div>
					)
				)}
			</nav>

			<div className="px-4 py-3 border-t border-slate-200">
				<div className="h-8 w-8 rounded-full bg-slate-300 overflow-hidden">
					<img
						src="/dp.jpg"
						alt="profile"
						className="w-full h-full object-cover"
					/>
				</div>
			</div>
		</aside>
	)
}